import { Bot, createBot } from "mineflayer";
import autoAuth from "mineflayer-auto-auth";
import { ModulesRegistry } from "./modules/index.js";
import { ModulePathfinding } from "./modules/pathfinding.js";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";
import { AgentState } from "./state.js";
import { StateStack } from "./stateStack.js";
import { ModulePvp } from "./modules/pvp.js";
import { Vec3 } from "vec3";

declare module "mineflayer" {
	interface Bot {
		agent: AgentWorker;
	}
}

export class AgentWorker {
	public readonly bot: Bot;
	private readonly moduleRegistry: ModulesRegistry;
	public readonly stateStack = new StateStack();
	public get state(): AgentState {
		return this.stateStack.current;
	}

	constructor(host: string, username: string, password: string) {
		this.bot = createBot({
			host: host,
			username: username,

			plugins: { "mineflayer-auto-auth": autoAuth },
			AutoAuth: {
				logging: true,
				password: password,
				ignoreRepeat: true,
			},
		});

		this.bot.agent = this;

		const bot = this.bot;
		this.moduleRegistry = new ModulesRegistry(bot, this);

		this.bot.once("spawn", async () => {
			this.moduleRegistry.initSpawn();
		});

		this.stateStack.stateSignal.add((newState) => {
			this.handleNewState(newState);
		});
	}

	//

	public async goto(goal: Vec3) {
		const id = this.stateStack.newState({ type: "moving", goal });
		await this.stateStack.waitForState(id);
	}

	public async mineChunk(spec: ChunkMiningSpec) {
		const id = this.stateStack.newState({ type: "miningChunk", spec });
		await this.stateStack.waitForState(id);
	}

	public async collectBlock(blockName: string, amount: number) {
		const id = this.stateStack.newState({ type: "colectBlock", blockName, amount });
		await this.stateStack.waitForState(id);
	}

	//

	private async handleNewState(state: AgentState) {
		switch (state.type) {
			case "combat": {
				if (state.isSelfDefense) return;
				await (this.moduleRegistry.get(ModulePvp) as ModulePvp).killEntity(state.entity);
				break;
			}

			case "miningChunk": {
				await this.bot.building.mineChunk(state.spec);
				break;
			}

			case "moving": {
				await (this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).goto(state.goal);
				break;
			}

			case "colectBlock": {
				const blockPos = this.bot.findBlocks({
					matching: (block) => block.name === state.blockName,
					count: state.amount,
				});

				const blocks = blockPos.map((pos) => this.bot.blockAt(pos)).filter((val) => val !== null);

				await this.bot.collectBlock.collect(blocks);
				break;
			}
		}

		this.stateStack.finishedState();
	}

	//

	public async waitForIdle() {
		await this.stateStack.waitForIdle();
	}
}

import { Bot, createBot } from "mineflayer";
import autoAuth from "mineflayer-auto-auth";
import { SECRETS } from "../secrets.js";
import { ModulesRegistry } from "./modules/index.js";
import pathfinder from "mineflayer-pathfinder";
import { ModulePathfinding } from "./modules/pathfinding.js";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";
import { AgentState } from "./state.js";
import { StateStack } from "./stateStack.js";
import { ModulePvp } from "./modules/pvp.js";

declare module "mineflayer" {
	interface Bot {
		agent: Agent;
	}
}

export class Agent {
	public readonly bot: Bot;
	private readonly moduleRegistry: ModulesRegistry;
	public readonly stateStack = new StateStack();
	public get state(): AgentState {
		return this.stateStack.current;
	}

	constructor(host: string, username: string) {
		this.bot = createBot({
			host: host,
			username: username,

			plugins: { "mineflayer-auto-auth": autoAuth },
			AutoAuth: {
				logging: true,
				password: SECRETS.passwd,
				ignoreRepeat: true,
			},
		});

		this.bot.agent = this;

		const bot = this.bot;
		this.moduleRegistry = new ModulesRegistry(bot, this);

		this.bot.once("spawn", async () => {
			this.moduleRegistry.initSpawn();
		});

		this.stateStack.stateSignal.add((newState: AgentState) => {
			this.handleNewState(newState);
		});
	}

	public goto(goal: pathfinder.goals.Goal) {
		this.stateStack.newState({ type: "moving", goal });
	}

	public stopWalking() {
		(this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).stop();
		this.stateStack.finishedState();
	}

	public mineChunk(spec: ChunkMiningSpec) {
		this.stateStack.newState({ type: "miningChunk", spec });
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
			}
		}

		this.stateStack.finishedState();
	}
}

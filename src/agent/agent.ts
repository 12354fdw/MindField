import { Bot, createBot } from "mineflayer";
import autoAuth from "mineflayer-auto-auth";
import { SECRETS } from "../secrets.js";
import { ModulesRegistry } from "./modules/index.js";
import pathfinder from "mineflayer-pathfinder";
import { ModulePathfinding } from "./modules/pathfinding.js";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";
import { AgentState } from "./state.js";
import { StateStack } from "./stateStack.js";

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
	}

	public goto(goal: pathfinder.goals.Goal): Promise<void> {
		this.stateStack.newState({ type: "moving", goal });
		return (this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).goto(goal).then(() => {
			this.stateStack.finishedState();
		});
	}

	public stopWalking() {
		(this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).stop();
		this.stateStack.finishedState();
	}

	public async mineChunk(spec: ChunkMiningSpec) {
		this.stateStack.newState({ type: "miningChunk", spec });
		await this.bot.building.mineChunk(spec);
		this.stateStack.finishedState();
	}
}

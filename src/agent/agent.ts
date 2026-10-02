import { Bot, createBot } from "mineflayer";
import autoAuth from "mineflayer-auto-auth";
import { SECRETS } from "../secrets.js";
import { ModulesRegistry } from "./modules/index.js";
import pathfinder from "mineflayer-pathfinder";
import { ModulePathfinding } from "./modules/pathfinding.js";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";
import { AgentState } from "./state.js";

declare module "mineflayer" {
	interface Bot {
		agent: Agent;
	}
}

export class Agent {
	public readonly bot: Bot;
	private readonly moduleRegistry: ModulesRegistry;
	public state: AgentState = { type: "idle" };

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
		this.moduleRegistry = new ModulesRegistry(bot);

		this.bot.once("spawn", async () => {
			this.moduleRegistry.initSpawn();
		});
	}

	//

	public async goto(goal: pathfinder.goals.Goal) {
		this.state = { type: "moving", goal };
		await (this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).goto(goal);
		this.state = { type: "idle" };
	}

	public stopWalking() {
		(this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).stop();
		this.state = { type: "idle" };
	}

	public async mineChunk(spec: ChunkMiningSpec) {
		this.state = { type: "miningChunk", spec };
		await this.bot.building.mineChunk(spec);
		this.state = { type: "idle" };
	}
}

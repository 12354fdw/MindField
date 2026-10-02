import { Bot, createBot } from "mineflayer";
import autoAuth from "mineflayer-auto-auth";
import { SECRETS } from "../secrets.js";
import { ModulesRegistry } from "./modules/index.js";
import pathfinder from "mineflayer-pathfinder";
import { ModulePathfinding } from "./modules/pathfinding.js";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";

declare module "mineflayer" {
	interface Bot {
		agent: Agent;
	}
}

export class Agent {
	public readonly bot: Bot;
	private readonly moduleRegistry: ModulesRegistry;

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
		await (this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).goto(goal);
	}

	public stopWalking() {
		(this.moduleRegistry.get(ModulePathfinding) as ModulePathfinding).stop();
	}

	public async mineChunk(spec: ChunkMiningSpec) {
		await this.bot.building.mineChunk(spec);
	}
}

import { Bot } from "mineflayer";
import { ChunkMiningSpec } from "../../orchestration/mining/miningManager.js";
import pathfinder from "mineflayer-pathfinder";

declare module "mineflayer" {
	interface Bot {
		building: {
			mineChunk: (chunkSpec: ChunkMiningSpec) => Promise<void>;
		};
	}
}

export function loader(bot: Bot) {
	bot.building = {
		mineChunk: async (chunkSpec) => {
			const goal = new pathfinder.goals.GoalBlock(chunkSpec.center.x, chunkSpec.center.y, chunkSpec.center.z);
			await bot.agent.goto(goal);
		},
	};
}

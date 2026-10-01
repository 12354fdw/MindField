import { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { ChunkMiningSpec } from "../../orchestration/mining/miningManager.js";

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
			
		},
	};
}

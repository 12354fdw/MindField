import { Bot } from "mineflayer";
import { ChunkMiningSpec } from "../../orchestration/mining/miningPlanner.js";
import { Vec3 } from "vec3";

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
			const { x, y, z } = chunkSpec.center;

			let allAir = true;
			for (let dx = -3; dx <= 3; dx++) {
				for (let dz = -3; dz <= 3; dz++) {
					const block = bot.blockAt(new Vec3(x + dx, y, z + dz));
					if (block && block.type !== 0) {
						allAir = false;
						break;
					}
				}
				if (!allAir) break;
			}

			if (allAir) return;

			await bot.agent.goto(chunkSpec.center);

			for (let dx = -3; dx <= 3; dx++) {
				for (let dz = -3; dz <= 3; dz++) {
					const target = new Vec3(x + dx, y, z + dz);
					const block = bot.blockAt(target);

					if (block) {
						try {
							bot.tool.equipForBlock(block);
							await bot.dig(block, true);
						} catch {
							//
						}
					}
				}
			}
		},
	};
}

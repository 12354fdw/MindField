import { Bot } from "mineflayer";
import { Vec3 } from "vec3";

declare module "mineflayer" {
	interface Bot {
		building: {
			mineArea: (a: Vec3, b: Vec3) => Promise<void>;
		};
	}
}

export function loader(bot: Bot) {
	bot.building = {
		mineArea: async (a: Vec3, b: Vec3) => {
		},
	};
}

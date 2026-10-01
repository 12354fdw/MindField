import { Bot } from "mineflayer";

declare module "mineflayer" {
	interface Bot {
		building: {
			test: (msg: string) => void;
		};
	}
}

export function loader(bot: Bot) {
	bot.building = {
		test: (msg: string) => {
			bot.chat(msg);
		},
	};
}

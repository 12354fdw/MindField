import { Bot, createBot } from "mineflayer";
import { loader as autoEat } from "mineflayer-auto-eat";
import autoAuth from "mineflayer-auto-auth";
import { SECRETS } from "../secrets.js";
import { ModulesRegistry } from "./modules/index.js";

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

		const bot = this.bot;
		this.moduleRegistry = new ModulesRegistry(bot);

		this.bot.once("spawn", async () => {
			bot.chat("hello");

			this.moduleRegistry.initSpawn();

			this.initEating(bot);
		});
	}

	//

	private initEating(bot: Bot) {
		bot.loadPlugin(autoEat);
		bot.autoEat.enableAuto();

		bot.autoEat.setOpts({
			returnToLastItem: true,
			minHealth: 20,
			priority: "saturation",
			offhand: true,
		});
	}
}

import { Bot, createBot } from "mineflayer";
import { loader as autoEat } from "mineflayer-auto-eat";
import { Movements, pathfinder } from "mineflayer-pathfinder";
import autoAuth from "mineflayer-auto-auth";
import { SECRETS } from "./secrets.js";

export class Agent {
	public readonly bot: Bot;

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

		this.bot.loadPlugin(pathfinder);

		const bot = this.bot;
		this.bot.once("spawn", async () => {
			bot.chat("hello");
			const move = new Movements(bot);

			// quick fix for the sea grass problem
			move.blocksToAvoid.add(bot.registry.blocksByName["seagrass"].id);
			move.blocksToAvoid.add(bot.registry.blocksByName["tall_seagrass"].id);
			move.blocksToAvoid.add(bot.registry.blocksByName["kelp"].id);

			move.allowSprinting = true;
			move.canOpenDoors = true;

			bot.pathfinder.setMovements(move);

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

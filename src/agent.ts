import { Bot, createBot } from "mineflayer";
import { Movements, pathfinder } from "mineflayer-pathfinder";

export class Agent {
	public readonly bot: Bot;

	constructor(host: string, username: string) {
		this.bot = createBot({
			host: host,
			username: username,
		});

		this.bot.loadPlugin(pathfinder);

		const bot = this.bot;
		this.bot.once("spawn", () => {
			const move = new Movements(bot);

			// quick fix for the sea grass problem
			move.blocksToAvoid.add(bot.registry.blocksByName["seagrass"].id);
			move.blocksToAvoid.add(bot.registry.blocksByName["tall_seagrass"].id);
			move.blocksToAvoid.add(bot.registry.blocksByName["kelp"].id);

			move.allowSprinting = true;
			move.canOpenDoors = true;

			bot.pathfinder.setMovements(move);
		});
	}
}

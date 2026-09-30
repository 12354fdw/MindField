import { Movements, pathfinder } from "mineflayer-pathfinder";
import { BaseModule } from "./base.js";

export class ModulePathfinding extends BaseModule {
	public initSpawn(): void {
		const bot = this.bot;

		bot.loadPlugin(pathfinder);
		const move = new Movements(bot);

		// quick fix for the sea grass problem
		move.blocksToAvoid.add(bot.registry.blocksByName["seagrass"].id);
		move.blocksToAvoid.add(bot.registry.blocksByName["tall_seagrass"].id);
		move.blocksToAvoid.add(bot.registry.blocksByName["kelp"].id);

		move.allowSprinting = true;
		move.canOpenDoors = true;

		bot.pathfinder.setMovements(move);
	}
}

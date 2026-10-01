import pathfinder, { Movements } from "mineflayer-pathfinder";
import { BaseModule } from "./base.js";

export class ModulePathfinding extends BaseModule {
	public initSpawn(): void {
		const bot = this.bot;

		bot.loadPlugin(pathfinder.pathfinder);
		const move = new Movements(bot);

		// quick fix for the sea grass problem
		move.blocksToAvoid.add(bot.registry.blocksByName["seagrass"].id);
		move.blocksToAvoid.add(bot.registry.blocksByName["tall_seagrass"].id);
		move.blocksToAvoid.add(bot.registry.blocksByName["kelp"].id);

		move.allowSprinting = true;
		move.canOpenDoors = true;

		bot.pathfinder.setMovements(move);
	}

	public async goto(goal: pathfinder.goals.Goal) {
		try {
			await this.bot.pathfinder.setGoal(goal);
		} catch {
			this.goto(goal);
		}
	}

	public stop() {
		this.bot.pathfinder.stop();
	}
}

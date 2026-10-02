import pathfinder, { Movements } from "mineflayer-pathfinder";
import { BaseModule } from "./base.js";
import { Vec3 } from "vec3";

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

	public async goto(pos: Vec3) {
		const goal = new pathfinder.goals.GoalBlock(pos.x, pos.y, pos.z);
		try {
			await this.bot.pathfinder.goto(goal);
		} catch (raw: unknown) {
			if (raw instanceof Error && raw.name === "GoalChanged") return;
			this.goto(pos);
		}
	}

	public stop() {
		this.bot.pathfinder.stop();
	}
}

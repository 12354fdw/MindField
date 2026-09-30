import { createBot } from "mineflayer";
import { SECRETS } from "./secrets.js";
import pathfinder, { Movements } from "mineflayer-pathfinder";

const bot = createBot({
	host: SECRETS.server,
	username: "gurtyo",
});

bot.loadPlugin(pathfinder.pathfinder);

bot.once("spawn", async () => {
	const move = new Movements(bot);

	// quick fix for the sea grass problem
	move.blocksToAvoid.add(bot.registry.blocksByName["seagrass"].id);
	move.blocksToAvoid.add(bot.registry.blocksByName["tall_seagrass"].id);
	move.blocksToAvoid.add(bot.registry.blocksByName["kelp"].id);

	move.allowSprinting = true;
	move.canOpenDoors = true;

	bot.pathfinder.setMovements(move);
});

bot.on("chat", async (username: string, msg: string) => {
	if (username === "gurtyo") return;

	const match = msg.match(/(-?\d+)\s+(-?\d+)\s+(-?\d+)/);

	if (match) {
		const coords = {
			x: parseInt(match[1], 10),
			y: parseInt(match[2], 10),
			z: parseInt(match[3], 10),
		};

		console.log(coords.x, coords.y, coords.z);

		const goal = new pathfinder.goals.GoalBlock(coords.x, coords.y, coords.z);
		try {
			await bot.pathfinder.goto(goal);
		} catch {
			//
		}
	}
});

import { createBot } from "mineflayer";
import { SECRETS } from "./secrets.js";
import baritone from "@miner-org/mineflayer-baritone";
import { Vec3 } from "vec3";

const loader = baritone.loader;
const goals = baritone.goals;

const bot = createBot({
	host: SECRETS.server,
	username: "gurtyo",
});

bot.loadPlugin(loader);

bot.once("spawn", () => {
	bot.ashfinder.config.parkour = true;
	bot.ashfinder.config.breakBlocks = true;
	bot.ashfinder.config.placeBlocks = true;
	bot.ashfinder.config.swimming = true;
});

bot.on("chat", async (username: string, msg: string) => {
	if (username === "gurtyo") return;

	bot.ashfinder.stop();

	const match = msg.match(/(-?\d+)\s+(-?\d+)\s+(-?\d+)/);

	if (match) {
		const coords = {
			x: parseInt(match[1], 10),
			y: parseInt(match[2], 10),
			z: parseInt(match[3], 10),
		};

		console.log(coords.x, coords.y, coords.z);

		const goal = new goals.GoalExact(new Vec3(coords.x, coords.y, coords.z));
		await bot.ashfinder.goto(goal);
	}
});

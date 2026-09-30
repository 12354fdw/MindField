import pathfinder from "mineflayer-pathfinder";
import { Agent } from "./agent/agent.js";
import { SECRETS } from "./secrets.js";

const agent = new Agent(SECRETS.server, "gurtyo");
const bot = agent.bot;

bot.on("whisper", async (username: string, msg: string) => {
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

import { createBot } from "mineflayer";
import { SECRETS } from "./secrets.js";

const bot = createBot({
	host: SECRETS.server,
	username: "gurtyo",
});

bot.on("chat", (username: string, msg: string) => {
	if (username === "gurtyo") return;

	const match = msg.match(/(-?\d+)\s+(-?\d+)\s+(-?\d+)/);

	if (match) {
		const coords = {
			x: parseInt(match[1], 10),
			y: parseInt(match[2], 10),
			z: parseInt(match[3], 10),
		};

		console.log(coords.x, coords.y, coords.z);
	}
});

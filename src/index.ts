import { createBot } from "mineflayer";
import { SECRETS } from "./secrets.js";

const bot = createBot({
	host: SECRETS.server,
	username: "gurtyo",
});

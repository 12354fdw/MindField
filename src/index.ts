import { Agent } from "./agent/agent.js";
import { SECRETS } from "./secrets.js";
import { CommandManager } from "./command/index.js";

const agent = new Agent(SECRETS.server, "gurtyo");
const bot = agent.bot;

const commandManager = new CommandManager();

bot.on("whisper", async (username: string, msg: string) => {
	if (username === "gurtyo") return;
	commandManager.runCommand(msg, { agent, source: username });
});

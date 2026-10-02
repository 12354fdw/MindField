import readline from "node:readline";
import { CommandManager } from "./command/index.js";
import { AgentManager } from "./orchestration/agentManger.js";

const manager = new AgentManager();

const commandManager = new CommandManager();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.on("line", (input: string) => {
	commandManager.runCommand(input, { agentManager: manager });
});

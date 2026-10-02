import { Agent } from "../agent/agent.js";

export type CommandContext = {
	agent: Agent;
	source: string;
};

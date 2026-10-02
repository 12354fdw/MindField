import { Bot } from "mineflayer";
import { AgentWorker } from "../agentWorker.js";

export abstract class BaseModule {
	constructor(
		protected bot: Bot,
		protected agent: AgentWorker,
	) {}

	public abstract initSpawn(): void;
}

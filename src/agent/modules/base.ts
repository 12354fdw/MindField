import { Bot } from "mineflayer";
import { AgentWorker } from "../agent.js";

export abstract class BaseModule {
	constructor(
		protected bot: Bot,
		protected agent: AgentWorker,
	) {}

	public abstract initSpawn(): void;
}

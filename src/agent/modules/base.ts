import { Bot } from "mineflayer";
import { Agent } from "../agent.js";

export abstract class BaseModule {
	constructor(
		protected bot: Bot,
		protected agent: Agent,
	) {}

	public abstract initSpawn(): void;
}

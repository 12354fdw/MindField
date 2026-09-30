import { Bot } from "mineflayer";

export abstract class BaseModule {
	constructor(protected bot: Bot) {}

	public abstract initSpawn(): void;
}

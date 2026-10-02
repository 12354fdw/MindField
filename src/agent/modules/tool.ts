import tool from "mineflayer-tool";
import { BaseModule } from "./base.js";

export class ModuleTool extends BaseModule {
	public initSpawn(): void {
		this.bot.loadPlugin(tool.plugin);
	}
}

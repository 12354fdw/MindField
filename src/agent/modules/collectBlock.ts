import { plugin as collectBlockLoader } from "mineflayer-collectblock";
import { BaseModule } from "./base.js";

export class ModuleCollectBlock extends BaseModule {
	public initSpawn(): void {
		this.bot.loadPlugin(collectBlockLoader);
	}
}

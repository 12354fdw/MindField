import { loader as buildingLoader } from "../../plugins/building/index.js";
import { BaseModule } from "./base.js";

export class ModuleBuilding extends BaseModule {
	public initSpawn(): void {
		this.bot.loadPlugin(buildingLoader);
	}
}

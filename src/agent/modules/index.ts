import { Bot } from "mineflayer";
import { BaseModule } from "./base.js";
import { ModulePathfinding } from "./pathfinding.js";
import { ModuleAutoeat } from "./autoeat.js";
import { ModulePvp } from "./pvp.js";
import { ModuleBuilding } from "./building.js";

export class ModulesRegistry {
	private modules = new Set<BaseModule>();

	constructor(private bot: Bot) {
		this.registerModule(ModulePathfinding);
		this.registerModule(ModuleAutoeat);
		this.registerModule(ModulePvp);
		this.registerModule(ModuleBuilding);
	}

	public initSpawn() {
		this.modules.forEach((module: BaseModule) => {
			module.initSpawn();
		});
	}

	//

	private registerModule(ModuleClass: new (bot: Bot) => BaseModule) {
		this.modules.add(new ModuleClass(this.bot));
	}
}

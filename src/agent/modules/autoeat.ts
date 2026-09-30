import { BaseModule } from "./base.js";
import { loader as autoEat } from "mineflayer-auto-eat";

export class ModuleAutoeat extends BaseModule {
	public initSpawn(): void {
		const bot = this.bot;
		bot.loadPlugin(autoEat);
		bot.autoEat.enableAuto();

		bot.autoEat.setOpts({
			returnToLastItem: true,
			minHealth: 20,
			priority: "saturation",
			offhand: true,
		});
	}
}

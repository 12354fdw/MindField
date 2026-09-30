import { BaseModule } from "./base.js";
import pvp from "mineflayer-pvp";

export class ModulePvp extends BaseModule {
	public initSpawn(): void {
		const bot = this.bot;

		bot.loadPlugin(pvp.plugin);

		bot.on("entityHurt", async (entity, source) => {
			bot.autoEat.setOpts({
				minHealth: 10,
			});

			if (entity !== bot.entity) return;

			this.equipItems();

			bot.pvp.attack(source);

			await new Promise<void>((resolve) => {
				bot.once("stoppedAttacking", () => {
					resolve();
				});
			});

			bot.autoEat.setOpts({
				minHealth: 20,
			});
		});
	}

	private equipItems() {
		const bot = this.bot;

		const axe = bot.inventory.items().find((item) => item.name.includes("axe"));
		const sword = bot.inventory.items().find((item) => item.name.includes("sword"));
		const shield = bot.inventory.items().find((item) => item.name.includes("shield"));

		if (shield) bot.equip(shield, "off-hand");
		if (sword) bot.equip(sword, "hand");
		if (axe) bot.equip(axe, "hand");
	}
}

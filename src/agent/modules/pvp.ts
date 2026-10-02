import { BaseModule } from "./base.js";
import pvp from "mineflayer-pvp";
import entity from "prismarine-entity";

export class ModulePvp extends BaseModule {
	public initSpawn(): void {
		const bot = this.bot;

		bot.loadPlugin(pvp.plugin);

		bot.on("entityHurt", async (entity, source) => {
			if (entity !== bot.entity) return;

			this.agent.stateStack.newState({
				type: "combat",
				isSelfDefense: true,
				entity: source,
			});

			bot.autoEat.setOpts({
				minHealth: 10,
			});

			this.killEntity(source);

			bot.autoEat.setOpts({
				minHealth: 20,
			});

			this.agent.stateStack.finishedState();
		});
	}

	public async killEntity(entity: entity.Entity) {
		this.equipItems();
		this.bot.pvp.attack(entity);

		await new Promise<void>((resolve) => {
			this.bot.once("stoppedAttacking", () => {
				resolve();
			});
		});
	}

	//

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

import { BaseModule } from "./base.js";
import pvp from "mineflayer-pvp";

export class ModulePvp extends BaseModule {
	private onStoppedUsingItem: (() => void) | null = null;
	private onBlockUpdate: (() => void) | null = null;

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

			this.registerPvpListeners();

			await new Promise<void>((resolve) => {
				bot.once("stoppedAttacking", () => {
					resolve();
				});
			});

			bot.autoEat.setOpts({
				minHealth: 20,
			});

			this.unregisterPvpListeners();
		});
	}

	private registerPvpListeners(): void {
		const bot = this.bot;

		if (this.onStoppedUsingItem) return;

		this.onStoppedUsingItem = () => {
			this.equipItems();
		};
		this.onBlockUpdate = () => {
			const item = bot.heldItem;
			if (item && !item.name.includes("sword") && !item.name.includes("axe")) {
				setTimeout(() => this.equipItems(), 50);
			}
		};

		bot.on("stoppedUsingItem", this.onStoppedUsingItem);
		bot.on("blockUpdate", this.onBlockUpdate);
	}

	private unregisterPvpListeners(): void {
		const bot = this.bot;

		if (this.onStoppedUsingItem) {
			bot.removeListener("stoppedUsingItem", this.onStoppedUsingItem);
			this.onStoppedUsingItem = null;
		}
		if (this.onBlockUpdate) {
			bot.removeListener("blockUpdate", this.onBlockUpdate);
			this.onBlockUpdate = null;
		}
	}

	public equipItems() {
		const bot = this.bot;

		const axe = bot.inventory.items().find((item) => item.name.includes("axe"));
		const sword = bot.inventory.items().find((item) => item.name.includes("sword"));
		const shield = bot.inventory.items().find((item) => item.name.includes("shield"));

		if (shield) bot.equip(shield, "off-hand");
		if (sword) bot.equip(sword, "hand");
		if (axe) bot.equip(axe, "hand");
	}
}

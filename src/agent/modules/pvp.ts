import { BaseModule } from "./base.js";
import pvp from "mineflayer-pvp";
import { Bot } from "mineflayer";
import { Item } from "prismarine-item";
import { Entity } from "prismarine-entity";

enum Response {
	Flee,
	Defend,
	Kill,
}
export class ModulePvp extends BaseModule {
	public initSpawn(): void {
		const bot = this.bot;

		bot.loadPlugin(pvp.plugin);

		bot.on("entityHurt", async (entity, attacker) => {
			if (entity !== bot.entity) return;

			bot.autoEat.setOpts({
				minHealth: 10,
			});

			this.equipCombatItems();

			const response = this.getFlightOrFightResponse(attacker);
			// the behaviour does NOT account for equipment changes yet
			// the behaviour does not account for the following mobs
			/*
			Warden
			Bosses (withers and ender dragon)
			Anything that flies
			Ranged mobs (not that well)
			*/
			switch (response) {
				case Response.Flee:
					// i have no idea how to code this or where the bot goes
					break;
				case Response.Defend:
					bot.pvp.viewDistance = 8;
					bot.pvp.attack(attacker);

					await new Promise<void>((resolve) => {
						bot.once("stoppedAttacking", () => {
							resolve();
						});
					});

					break;
				case Response.Kill:
					bot.pvp.viewDistance = 128;
					bot.pvp.attack(attacker);

					await new Promise<void>((resolve) => {
						bot.once("stoppedAttacking", () => {
							resolve();
						});
					});

					break;
				default:
					break;
			}

			console.log("combat ended");
			bot.autoEat.setOpts({
				minHealth: 20,
			});
		});
	}

	public equipCombatItems() {
		const bot = this.bot;

		const axe = bot.inventory.items().find((item) => item.name.includes("axe"));
		const sword = bot.inventory.items().find((item) => item.name.includes("sword"));
		const shield = bot.inventory.items().find((item) => item.name.includes("shield"));

		if (shield) bot.equip(shield, "off-hand");
		if (axe) bot.equip(axe, "hand");
		else if (sword) bot.equip(sword, "hand");
	}

	private getFlightOrFightResponse(entity: Entity): Response {
		// add creeper behaviour
		// add warden "stealth" behaviour
		const combatFactor = this.getEquipmentFactor(this.bot.entity);
		const enemyCombatFactor = this.getEquipmentFactor(entity) + this.getEntityTypeFactor(entity);

		console.log(entity);
		console.log("Own equipment factor ", this.getEquipmentFactor(this.bot.entity));
		console.log("Enemy entity type factor ", entity.name, this.getEntityTypeFactor(entity));
		console.log("Enemy equipment factor ", this.getEquipmentFactor(entity));
		if (enemyCombatFactor > combatFactor + 25) return Response.Flee;
		if (enemyCombatFactor > combatFactor) return Response.Defend;
		if (combatFactor >= enemyCombatFactor) return Response.Kill;
		return Response.Flee;
	}

	private getItemFactor(item: Item | undefined): number {
		if (item) {
			switch (item.displayName.split(" ")[0]) {
				case "Netherite":
					return 100;
					break;
				case "Diamond":
					return 50;
					break;
				case "Gold":
					return 35;
					break;
				case "Iron":
					return 25;
					break;
				case "Copper":
					return 15;
					break;
				case "Stone":
					return 8;
					break;
				case "Wooden":
					return 4;
					break;
				default:
					return 20;
					break;
			}
		}
		return 0;
	}

	private getEquipmentFactor(entity: Entity) {
		let combatFactor = 0;
		combatFactor += this.getItemFactor(entity.equipment.find((item) => item && item.name.includes("axe")));
		combatFactor += this.getItemFactor(entity.equipment.find((item) => item && item.name.includes("sword")));
		combatFactor += this.getItemFactor(entity.equipment.find((item) => item && item.name.includes("helmet"))) - 5;
		combatFactor +=
			this.getItemFactor(entity.equipment.find((item) => item && item.name.includes("chestplate"))) - 5;
		combatFactor += this.getItemFactor(entity.equipment.find((item) => item && item.name.includes("leggings"))) - 5;
		combatFactor += this.getItemFactor(entity.equipment.find((item) => item && item.name.includes("boots"))) - 5;
		if (entity.equipment.find((item) => item && item.name.includes("shield"))) combatFactor += 25;
		return combatFactor;
	}

	private getEntityTypeFactor(entity: Entity) {
		switch (entity.name) {
			case "player":
				return 0;
			case "blaze":
				return 50;
			case "bogged":
				return 25;
			case "breeze":
				return 50;
			case "camel_husk":
				return 0;
			case "creaking":
				return 999999999;
			case "creeper":
				return 999999999;
			case "drowned":
				return 5;
			case "elder_guardian":
				return 75;
			case "ender_dragon":
				return 125;
			case "endermite":
				return 0;
			case "evoker":
				return 45;
			case "ghast":
				return 999999999;
			case "guardian":
				return 69;
			case "hoglin":
				return 75;
			case "husk":
				return 0;
			case "magma_cube":
				return 55;
			case "parched":
				return 5;
			case "phantom":
				return 35;
			case "piglin_brute":
				return 75;
			case "pillager":
				return 45;
			case "ravager":
				return 125;
			case "shulker":
				return 85;
			case "silverfish":
				return 15;
			case "skeleton":
				return 45;
			case "slime":
				return 25;
			case "stray":
				return 55;
			case "vex":
				return 45;
			case "vindicator":
				return 65;
			case "warden":
				return 999999999;
			case "witch":
				return 125;
			case "wither":
				return 999999999;
			case "wither_skeleton":
				return 45;
			case "zoglin":
				return 55;
			case "zombie":
				return 0;
			case "zombie_villager":
				return 0;
			case "zombified_piglin":
				return 15;
			default:
				return 0;
		}
	}
}

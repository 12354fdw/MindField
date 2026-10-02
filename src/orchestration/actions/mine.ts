import { Vec3 } from "vec3";
import { OrchestratedAction } from "./base.js";
import { MiningPlanner } from "../mining/miningPlanner.js";

type MiningActionOptions = {
	a: Vec3;
	b: Vec3;
};

export class OrchestratedMiningAction extends OrchestratedAction<MiningActionOptions> {
	public async execute({ a, b }: MiningActionOptions): Promise<void> {
		const planner = new MiningPlanner(a, b);
		
	}
}

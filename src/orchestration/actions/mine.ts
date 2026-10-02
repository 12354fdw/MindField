import { Vec3 } from "vec3";
import { OrchestratedAction } from "./base.js";
import { ChunkMiningSpec, MiningPlanner } from "../mining/miningPlanner.js";
import { Agent } from "../../agent/agent.js";
type MiningActionOptions = {
	a: Vec3;
	b: Vec3;
};

export class OrchestratedMiningAction extends OrchestratedAction<MiningActionOptions> {
	private chunks: ChunkMiningSpec[] = [];

	public async execute({ a, b }: MiningActionOptions): Promise<void> {
		const planner = new MiningPlanner(a, b);
		this.chunks = planner.chunks;

		for (const agent of this.assignedAgents) {
			this.assignChunkToAgent(agent);
		}
	}

	public async assignChunkToAgent(agent: Agent) {
		const chunk = this.chunks.shift();

		if (!chunk) {
			this.agentManager.freeAgent(agent);
			return;
		}

		await agent.mineChunk(chunk);
		this.assignChunkToAgent(agent);
	}
}

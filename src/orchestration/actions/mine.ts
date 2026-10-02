import { Vec3 } from "vec3";
import { OrchestratedAction } from "./base.js";
import { ChunkMiningSpec, MiningPlanner } from "../mining/miningPlanner.js";
import { Agent } from "../../agent/agent.js";
import { AgentState } from "../../agent/state.js";

type MiningActionOptions = {
	a: Vec3;
	b: Vec3;
};

export class OrchestratedMiningAction extends OrchestratedAction<MiningActionOptions> {
	private chunks: ChunkMiningSpec[] = [];
	private agentListenerRemoves = new Map<Agent, () => void>();

	public async execute({ a, b }: MiningActionOptions): Promise<void> {
		const planner = new MiningPlanner(a, b);
		this.chunks = planner.chunks;

		this.assignedAgents.forEach((agent) => {
			const remove = agent.stateSignal.add((newState: AgentState) => {
				if (newState.type === "idle") {
					this.assignChunkToAgent(agent);
				}
			}).remove;

			this.agentListenerRemoves.set(agent, remove);

			this.assignChunkToAgent(agent);
		});
	}

	public assignChunkToAgent(agent: Agent) {
		const chunk = this.chunks.shift();

		if (!chunk) {
			this.agentListenerRemoves.get(agent)!();
			this.freeAgent(agent);
			return;
		}

		agent.mineChunk(chunk);
	}
}

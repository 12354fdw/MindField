import { Remote } from "comlink";
import { AgentWorker } from "./agentWorker.js";
import { StateStack } from "./stateStack.js";
import { AgentState } from "./state.js";
import pathfinder from "mineflayer-pathfinder";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";

export class Agent {
	constructor(private remote: Remote<AgentWorker>) {}

	public async getStateStack(): Promise<StateStack> {
		return await this.remote.stateStack;
	}

	public async getState(): Promise<AgentState> {
		return await this.remote.state;
	}

	public async goto(goal: pathfinder.goals.Goal): Promise<void> {
		await this.remote.goto(goal);
	}

	public async mineChunk(spec: ChunkMiningSpec): Promise<void> {
		await this.remote.mineChunk(spec);
	}
}

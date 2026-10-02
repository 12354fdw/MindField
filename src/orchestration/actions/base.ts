import { Agent } from "../../agent/agent.js";

export abstract class OrchestratedAction {
	constructor(protected assignedAgents: Agent[]) {}

	public abstract execute(): Promise<void> | void;
}

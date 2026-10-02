import { Agent } from "../../agent/agent.js";

export abstract class OrchestratedAction<TOpts> {
	constructor(
		protected assignedAgents: Agent[],
		protected freeAgent: (agent: Agent) => void,
	) {}

	public abstract execute(options: TOpts): Promise<void> | void;
}

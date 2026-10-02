import { Agent } from "../../agent/agent.js";
import { AgentManager } from "../agentManger.js";

export abstract class OrchestratedAction<TOpts> {
	constructor(
		protected assignedAgents: Agent[],
		protected agentManager: AgentManager,
	) {}

	public abstract execute(options: TOpts): Promise<void> | void;
}

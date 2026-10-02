import { AgentWorker } from "../../agent/agentWorker.js";
import { AgentManager } from "../agentManger.js";

export abstract class OrchestratedAction<TOpts> {
	constructor(
		protected assignedAgents: AgentWorker[],
		protected agentManager: AgentManager,
	) {}

	public abstract execute(options: TOpts): Promise<void> | void;
}

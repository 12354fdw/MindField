import { Agent } from "../../agent/agent.js";

export abstract class OrchestratedAction<TOpts> {
	constructor(protected assignedAgents: Agent[]) {}

	public abstract execute(options: TOpts): Promise<void> | void;
}

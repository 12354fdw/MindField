import { Agent } from "../agent/agent.js";
import { SECRETS } from "../secrets.js";

export class AgentManager {
	private agents: Agent[] = [];

	constructor() {
		for (let i = 0; i < SECRETS.agentCount; i++) {
			this.agents.push(new Agent(SECRETS.server, `gurtyo${i}`));
		}
	}
}

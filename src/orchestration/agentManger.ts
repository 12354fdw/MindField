import { Agent } from "../agent/agent.js";
import { SECRETS } from "../secrets.js";

export class AgentManager {
	private agents = new Set<Agent>();
	private idleAgents = new Set<Agent>();

	constructor() {
		for (let i = 0; i < SECRETS.agentCount; i++) {
			const agent = new Agent(SECRETS.server, `gurtyo${i}`);
			this.agents.add(agent);
			this.idleAgents.add(agent);
		}
	}

	// !!! WILL RETURN LESS IF THERE ARE NOT ENOUGH AGENTS !!!
	public getIdleAgents(count: number) {
		const result: Agent[] = [];
		for (const agent of this.idleAgents) {
			if (result.length >= count) break;
			result.push(agent);
			this.idleAgents.delete(agent);
		}
		return result;
	}

	public freeAgent(agent: Agent) {
		this.idleAgents.add(agent);
	}
}

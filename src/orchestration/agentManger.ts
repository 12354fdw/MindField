import { AgentWorker } from "../agent/agent.js";
import { SECRETS } from "../secrets.js";

export class AgentManager {
	private agents = new Set<AgentWorker>();
	private idleAgents = new Set<AgentWorker>();

	constructor() {
		for (let i = 0; i < SECRETS.agentCount; i++) {
			const agent = new AgentWorker(SECRETS.server, `gurtyo${i}`);
			this.agents.add(agent);
			this.idleAgents.add(agent);
		}
	}

	// !!! WILL RETURN LESS IF THERE ARE NOT ENOUGH AGENTS !!!
	public getIdleAgents(count: number) {
		const result: AgentWorker[] = [];
		for (const agent of this.idleAgents) {
			if (result.length >= count) break;
			result.push(agent);
			this.idleAgents.delete(agent);
		}
		return result;
	}

	public freeAgent(agent: AgentWorker) {
		this.idleAgents.add(agent);
	}
}

import { wrap } from "comlink";
import { AgentWorker } from "../agent/agentWorker.js";
import { SECRETS } from "../secrets.js";
import { nodeEndpoint } from "../utils/nodeEndpoint.js";
import { Worker } from "worker_threads";
import { Agent } from "../agent/agent.js";

export class AgentManager {
	private agents = new Set<Agent>();
	private idleAgents = new Set<Agent>();

	constructor() {
		for (let i = 0; i < SECRETS.agentCount; i++) {
			const worker = new Worker("./src/agent/worker.ts", {
				workerData: {
					host: SECRETS.server,
					username: `gurtyo${i}`,
					passwd: SECRETS.passwd,
				},
			});

			const agentWorker = wrap<AgentWorker>(nodeEndpoint(worker));
			const agent = new Agent(agentWorker);

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

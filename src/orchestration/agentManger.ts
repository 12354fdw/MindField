import { wrap } from "comlink";
import { AgentWorker } from "../agent/agentWorker.js";
import { SECRETS } from "../secrets.js";
import { nodeEndpoint } from "../utils/nodeEndpoint.js";
import { Worker } from "worker_threads";

export class AgentManager {
	private agents = new Set<AgentWorker>();
	private idleAgents = new Set<AgentWorker>();

	constructor() {
		for (let i = 0; i < SECRETS.agentCount; i++) {
			const worker = new Worker("../agent/worker.ts", {
				workerData: {
					host: SECRETS.server,
					username: `gurtyo${i}`,
					passwd: SECRETS.passwd,
				},
			});

			const agentWorker = wrap<AgentWorker>(nodeEndpoint(worker));
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

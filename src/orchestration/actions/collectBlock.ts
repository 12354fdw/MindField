import { Agent } from "../../agent/agent.js";
import { OrchestratedAction } from "./base.js";

type CollectionActionOptions = {
	blockName: string;
	amount: number;
};

export class OrchestratedCollectionAction extends OrchestratedAction<CollectionActionOptions> {
	public async execute({ blockName, amount }: CollectionActionOptions): Promise<void> {
		const agentCount = this.assignedAgents.length;
		if (agentCount === 0) return;

		const baseAmount = Math.floor(amount / agentCount);
		const remainder = amount % agentCount;

		for (let i = 0; i < this.assignedAgents.length; i++) {
			const agentAmount = i < remainder ? baseAmount + 1 : baseAmount;
			if (agentAmount === 0) {
				this.agentManager.freeAgent(this.assignedAgents[i]);
				continue;
			}

			this.collectBlock(this.assignedAgents[i], blockName, agentAmount);
		}
	}

	private async collectBlock(agent: Agent, blockName: string, amount: number) {
		await agent.collectBlock(blockName, amount);
		this.agentManager.freeAgent(agent);
	}
}

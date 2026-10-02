import { Entity } from "prismarine-entity";
import pathfinder from "mineflayer-pathfinder";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";

export type AgentState =
	| {
			type: "idle";
	  }
	| {
			type: "moving";
			goal: pathfinder.goals.Goal;
	  }
	| {
			type: "combat";
			isSelfDefense: boolean;
			entity: Entity;
	  }
	| {
			type: "miningChunk";
			spec: ChunkMiningSpec;
	  };

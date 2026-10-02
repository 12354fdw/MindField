import { Entity } from "prismarine-entity";
import { ChunkMiningSpec } from "../orchestration/mining/miningPlanner.js";
import { Vec3 } from "vec3";

export type AgentState =
	| {
			type: "idle";
	  }
	| {
			type: "moving";
			goal: Vec3;
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

import { Vec3 } from "vec3";

export interface ChunkMiningSpec {
	center: Vec3;
}

export class MiningPlanner {
	public readonly chunks: ChunkMiningSpec[] = [];

	constructor(a: Vec3, b: Vec3) {
		this.generateChunkMiningSpecs(a, b);
	}

	private generateChunkMiningSpecs(a: Vec3, b: Vec3) {
		const minX = Math.min(a.x, b.x);
		const maxX = Math.max(a.x, b.x);
		const minY = Math.min(a.y, b.y);
		const maxY = Math.max(a.y, b.y);
		const minZ = Math.min(a.z, b.z);
		const maxZ = Math.max(a.z, b.z);

		for (let y = maxY; y >= minY; y--) {
			for (let x = minX + 3; x <= maxX; x += 7) {
				for (let z = minZ + 3; z <= maxZ; z += 7) {
					this.chunks.push({
						center: new Vec3(x, y, z),
					});
				}
			}
		}
	}
}

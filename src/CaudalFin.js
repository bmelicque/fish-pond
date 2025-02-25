import { NODE_DIST, Chunk } from "./Fish.js";
import Vec2 from "./Vector2.js";

export default class CaudalFin {
	#node;

	constructor(color = "white") {
		this.#node = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.#node.style.strokeWidth = "0.1";
		this.#node.style.filter = "brightness(200%)";
		this.#node.setAttribute("fill", color);
		this.#node.setAttribute("stroke", color);
	}

	get node() {
		return this.#node;
	}

	/**
	 *
	 * @param {Chunk[]} chunks
	 */
	#getBodyCurvature(chunks) {
		const orientations = new Array(chunks.length - 1);
		for (let i = 0; i < orientations.length; i++) {
			orientations[i] = Vec2.diff(chunks[i].position, chunks[i + 1].position);
		}
		const angles = new Array(orientations.length - 1).fill(0);
		return angles.reduce((a, _, i) => a + Vec2.angle(orientations[i], orientations[i + 1]), 0) / angles.length;
	}

	/**
	 *
	 * @param {Chunk[]} chunks
	 */
	updateFromChunks(chunks) {
		const start = chunks[chunks.length - 2].position;
		const mid = chunks[chunks.length - 1].position;
		const outerAngle = Vec2.angle(start, mid);
		const outerEnd = Vec2.diff(mid, start)
			.rotate(outerAngle)
			.resize(3 * NODE_DIST)
			.add(mid);
		const curvature = this.#getBodyCurvature(chunks);
		const innerEnd = Vec2.diff(mid, start)
			.rotate(outerAngle + 3 * curvature)
			.resize(3 * NODE_DIST)
			.add(mid);
		const firstEnd = { x: (2 * outerEnd.x + innerEnd.x) / 3, y: (2 * outerEnd.y + innerEnd.y) / 3 };
		const secondEnd = { x: (outerEnd.x + 2 * innerEnd.x) / 3, y: (outerEnd.y + 2 * innerEnd.y) / 3 };
		const path = `M${start.x},${start.y} Q${outerEnd.x},${outerEnd.y} ${firstEnd.x},${firstEnd.y} L${secondEnd.x},${secondEnd.y} Q${innerEnd.x},${innerEnd.y} ${start.x},${start.y}`;
		this.#node.setAttribute("d", path);
	}
}

import { Chunk } from "./Fish";

export default class DorsalFin {
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
	updateFromChunks(chunks) {
		const start = chunks[5].position;
		const end = chunks[9].position;
		const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
		const inner = chunks[7].position;
		const outer = { x: (inner.x - mid.x) * 3.5 + mid.x, y: (inner.y - mid.y) * 3.5 + mid.y };
		const path = `M${start.x},${start.y} Q${inner.x},${inner.y} ${end.x},${end.y} Q${outer.x},${outer.y} ${start.x},${start.y}`;
		this.#node.setAttribute("d", path);
	}
}

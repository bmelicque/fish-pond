import { Chunk } from "./Fish.js";
import Vec2 from "./Vector2.js";

export default class FishBody {
	#node;

	constructor(color = "white") {
		this.#node = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.#node.setAttribute("fill", color);
	}

	get node() {
		return this.#node;
	}

	/**
	 * Get the points used to draw the body shape from raw chunks
	 * @param {Chunk[]} chunks
	 * @returns {Vec2[]}
	 */
	#getBodyPoints(chunks) {
		const orientations = new Array(chunks.length - 1);
		for (let i = 0; i < orientations.length; i++) {
			orientations[i] = Vec2.diff(chunks[i].position, chunks[i + 1].position);
		}
		const head = orientations[0].clone().resize(chunks[0].radius).add(chunks[0].position);
		const lhs = [head];
		const rhs = [];

		lhs.push(
			orientations[0]
				.clone()
				.resize(chunks[0].radius)
				.rotate(Math.PI / 4)
				.add(chunks[0].position)
		);
		rhs.push(
			orientations[0]
				.clone()
				.resize(chunks[0].radius)
				.rotate(-Math.PI / 4)
				.add(chunks[0].position)
		);

		for (let i = 0; i < chunks.length - 1; i++) {
			lhs.push(orientations[i].ccwNormal().resize(chunks[i].radius).add(chunks[i].position));
			rhs.push(orientations[i].cwNormal().resize(chunks[i].radius).add(chunks[i].position));
		}

		const last = chunks.at(-1);
		if (!last) throw new Error("chunks are empty!!");
		lhs.push(last.position);

		return lhs.concat(rhs.reverse());
	}

	/**
	 * Update drawn SVG path using a list of fish chunks
	 * @param {Chunk[]} chunks
	 */
	updateFromChunks(chunks) {
		let points = this.#getBodyPoints(chunks);
		if (points.length < 3) return;

		points.unshift(points[points.length - 3], points[points.length - 2], points[points.length - 1]);
		points.pop();
		points.pop();
		points.pop();

		let path = `M${points[0].x},${points[0].y}`;

		for (let i = 1; i < points.length; i += 3) {
			const p1 = points[i];
			const p2 = points[(i + 1) % points.length];
			const p3 = points[(i + 2) % points.length];

			path += ` C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
		}

		path += " Z";
		this.#node.setAttribute("d", path);
	}
}

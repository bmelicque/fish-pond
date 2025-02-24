import { Chunk } from "./Fish";
import Vec2 from "./Vector2";

export default class LateralFin {
	#node;
	#at;
	#side;

	/**
	 * @param {number} at The body chunk at which the fin is located
	 * @param {1 | -1} side The body side on which the fin is located
	 * @param {number} length The fin's length
	 * @param {string} [color] The fin's color
	 */
	constructor(at, side, length, color = "white") {
		this.#node = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
		this.#node.setAttribute("rx", length.toString());
		this.#node.setAttribute("ry", (length / 2).toString());
		this.#node.setAttribute("transform-origin", "center");
		this.#node.style.transformBox = "fill-box";
		this.#node.style.filter = "brightness(200%)";
		this.#node.setAttribute("fill", color);
		this.#at = at;
		this.#side = side;
	}

	/**
	 * Returns the DOM node representing this fin
	 */
	get node() {
		return this.#node;
	}

	/**
	 * Get the orientation of the chunk used as a reference for this fin's orientation
	 * @param {Chunk[]} chunks
	 * @returns
	 */
	#getChunkOrientation(chunks) {
		// the fins align themselves with anterior chunks to mimic steering
		const segmentOrientation = Vec2.diff(chunks[this.#at - 3].position, chunks[this.#at - 1].position);
		return Vec2.angle(segmentOrientation, Vec2.x);
	}

	/**
	 *
	 * @param {Chunk[]} chunks
	 * @returns
	 */
	#getFinPosition(chunks) {
		const prev = chunks[this.#at - 1].position;
		const next = chunks[this.#at + 1].position;
		return Vec2.diff(prev, next)
			.rotate((this.#side * Math.PI) / 2)
			.resize(chunks[this.#at].radius)
			.add(chunks[this.#at].position);
	}

	/**
	 *
	 * @param {Chunk[]} chunks
	 * @returns {void}
	 */
	updateFromChunks(chunks) {
		const chunkOrientation = this.#getChunkOrientation(chunks);
		const finOrientation = (-chunkOrientation * 180) / Math.PI - this.#side * 30;
		this.#node.setAttribute("transform", `rotate(${finOrientation})`);

		const position = this.#getFinPosition(chunks);
		this.#node.setAttribute("cx", position.x.toString());
		this.#node.setAttribute("cy", position.y.toString());
	}
}

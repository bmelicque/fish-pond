import { Chunk } from "./Fish.js";
import Vec2 from "./Vector2.js";

export default class LateralFin {
	#at;
	#side;
	#length;
	#color;

	/**
	 * @param {number} at The body chunk at which the fin is located
	 * @param {1 | -1} side The body side on which the fin is located
	 * @param {number} length The fin's length
	 * @param {string} [color] The fin's color
	 */
	constructor(at, side, length, color = "white") {
		this.#at = at;
		this.#side = side;
		this.#length = length;
		// TODO: lighten color
		this.#color = color;
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
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Chunk[]} chunks
	 */
	drawFromChunks(ctx, chunks) {
		const scale = innerWidth / 100;

		const chunkOrientation = this.#getChunkOrientation(chunks);
		const position = this.#getFinPosition(chunks);

		const finOrientation = -chunkOrientation - (this.#side * Math.PI) / 6;
		ctx.beginPath();
		ctx.ellipse(
			position.x * scale,
			position.y * scale,
			this.#length * scale,
			(this.#length * scale) / 2,
			finOrientation,
			0,
			2 * Math.PI
		);
		ctx.closePath();
		ctx.fillStyle = this.#color;
		ctx.fill();
	}
}

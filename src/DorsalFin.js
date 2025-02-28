import { Chunk } from "./Fish.js";

export default class DorsalFin {
	#color;

	constructor(color = "white") {
		this.#color = color;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Chunk[]} chunks
	 */
	drawFromChunks(ctx, chunks) {
		const scale = Math.max(innerWidth, innerHeight) / 100;

		const start = chunks[5].position.clone().scale(scale);
		const end = chunks[9].position.clone().scale(scale);
		const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
		const inner = chunks[7].position.clone().scale(scale);
		const outer = { x: (inner.x - mid.x) * 3.5 + mid.x, y: (inner.y - mid.y) * 3.5 + mid.y };

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.quadraticCurveTo(inner.x, inner.y, end.x, end.y);
		ctx.quadraticCurveTo(outer.x, outer.y, start.x, start.y);
		ctx.closePath();
		ctx.fillStyle = this.#color;
		ctx.fill();
		ctx.strokeStyle = this.#color;
		ctx.lineWidth = innerWidth / 1000;
		ctx.stroke();
	}
}

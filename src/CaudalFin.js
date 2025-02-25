import { NODE_DIST, Chunk } from "./Fish.js";
import Vec2 from "./Vector2.js";

export default class CaudalFin {
	#color;

	constructor(color = "white") {
		this.#color = color;
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
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Chunk[]} chunks
	 */
	drawFromChunks(ctx, chunks) {
		const scale = innerWidth / 100;
		const start = chunks[chunks.length - 2].position.clone().scale(scale);
		const mid = chunks[chunks.length - 1].position.clone().scale(scale);
		const outerAngle = Vec2.angle(start, mid);
		const outerEnd = Vec2.diff(mid, start)
			.rotate(outerAngle)
			.resize(3 * NODE_DIST * scale)
			.add(mid);
		const curvature = this.#getBodyCurvature(chunks);
		const innerEnd = Vec2.diff(mid, start)
			.rotate(outerAngle + 3 * curvature)
			.resize(3 * NODE_DIST * scale)
			.add(mid);
		const firstEnd = { x: (2 * outerEnd.x + innerEnd.x) / 3, y: (2 * outerEnd.y + innerEnd.y) / 3 };
		const secondEnd = { x: (outerEnd.x + 2 * innerEnd.x) / 3, y: (outerEnd.y + 2 * innerEnd.y) / 3 };

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.quadraticCurveTo(outerEnd.x, outerEnd.y, firstEnd.x, firstEnd.y);
		ctx.lineTo(secondEnd.x, secondEnd.y);
		ctx.quadraticCurveTo(innerEnd.x, innerEnd.y, start.x, start.y);
		ctx.closePath();
		ctx.fillStyle = this.#color;
		ctx.fill();
		ctx.strokeStyle = this.#color;
		ctx.lineWidth = innerWidth / 1000;
		ctx.stroke();
	}
}

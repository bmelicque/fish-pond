import CaudalFin from "./CaudalFin.js";
import DorsalFin from "./DorsalFin.js";
import { Chunk, Fish, LIGHTER_COLORS, NODE_DIST } from "./Fish.js";
import FishBody from "./FishBody.js";
import LateralFin from "./LateralFin.js";

export default class FishElement {
	#body;
	#fins;

	/**
	 * @param {Fish} fish
	 */
	constructor(fish) {
		this.#fins = [
			new LateralFin(3, 1, 1.5 * NODE_DIST, LIGHTER_COLORS[fish.color]),
			new LateralFin(3, -1, 1.5 * NODE_DIST, LIGHTER_COLORS[fish.color]),
			new LateralFin(9, 1, NODE_DIST, LIGHTER_COLORS[fish.color]),
			new LateralFin(9, -1, NODE_DIST, LIGHTER_COLORS[fish.color]),
			new CaudalFin(LIGHTER_COLORS[fish.color]),
			new DorsalFin(LIGHTER_COLORS[fish.color]),
		];
		this.#body = new FishBody(fish.color);
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Chunk[]} chunks
	 */
	drawFromChunks(ctx, chunks) {
		for (let fin of this.#fins.slice(0, -1)) {
			fin.drawFromChunks(ctx, chunks);
		}
		this.#body.drawFromChunks(ctx, chunks);
		this.#fins.at(-1).drawFromChunks(ctx, chunks);
	}
}

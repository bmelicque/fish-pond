import CaudalFin from "./CaudalFin.js";
import DorsalFin from "./DorsalFin.js";
import { Chunk, Fish, NODE_DIST } from "./Fish.js";
import FishBody from "./FishBody.js";
import LateralFin from "./LateralFin.js";

export default class FishElement {
	#node;
	#body;
	#fins;

	/**
	 * @param {Fish} fish
	 */
	constructor(fish) {
		this.#node = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.#fins = [
			new LateralFin(3, 1, 1.5 * NODE_DIST, fish.color),
			new LateralFin(3, -1, 1.5 * NODE_DIST, fish.color),
			new LateralFin(9, 1, NODE_DIST, fish.color),
			new LateralFin(9, -1, NODE_DIST, fish.color),
			new CaudalFin(fish.color),
			new DorsalFin(fish.color),
		];
		for (let fin of this.#fins.slice(0, -1)) {
			this.#node.appendChild(fin.node);
		}
		this.#body = new FishBody(fish.color);
		this.#node.appendChild(this.#body.node);
		this.#node.appendChild(this.#fins[this.#fins.length - 1].node);
		this.updateFromChunks(fish.chunks);
	}

	get node() {
		return this.#node;
	}

	/**
	 * Update the model using a list of chunks
	 * @param {Chunk[]} chunks
	 */
	updateFromChunks(chunks) {
		for (let fin of this.#fins) {
			fin.updateFromChunks(chunks);
		}
		this.#body.updateFromChunks(chunks);
	}
}

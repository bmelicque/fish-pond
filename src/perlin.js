import Vec2 from "./Vector2.js";

/**
 * Return a seeded random number generator
 * @param {number} seed
 * @returns {() => number}
 */
function seededRandom(seed) {
	return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
}

/**
 * Linear interpolation
 * @param {number} from
 * @param {number} to
 * @param {number} at from 0 to 1
 */
function interpolate(from, to, at) {
	return from + at * (to - from);
}

/**
 * Easing function
 * @param {number} t from 0 to 1
 * @returns {number} eased number (still from 0 to 1)
 */
function ease(t) {
	return (3 - 2 * t) * t * t;
}

const GRID_SIDE = 16;

export class PerlinNoise {
	#grid;

	/**
	 * Initialize a seeded Perlin noise
	 * @constructor
	 * @param {number} seed
	 */
	constructor(seed) {
		const random = seededRandom(seed);
		const randomUnitVec = () => {
			const alpha = random() * Math.PI * 2;
			return new Vec2(Math.cos(alpha), Math.sin(alpha));
		};
		this.#grid = Array.from({ length: GRID_SIDE }, () => Array.from({ length: GRID_SIDE }, randomUnitVec));
	}

	/**
	 * Compute dot product between the point's displacement from a grid corner
	 * and that corner's random gradient
	 * @param {number} pointX
	 * @param {number} pointY
	 * @param {number} cornerX
	 * @param {number} cornerY
	 * @returns {number}
	 */
	#gridDot(pointX, pointY, cornerX, cornerY) {
		const gradient = this.#grid[cornerY % GRID_SIDE][cornerX % GRID_SIDE];
		const dx = pointX - cornerX;
		const dy = pointY - cornerY;
		return dx * gradient.x + dy * gradient.y;
	}

	/**
	 * Get the noise's value at given coordinates
	 * @param {number} x
	 * @param {number} y
	 * @returns {number}
	 */
	get(x, y) {
		const x0 = Math.floor(x);
		const x1 = x0 + 1;
		const y0 = Math.floor(y);
		const y1 = y0 + 1;

		const easedX = ease(x - x0);
		const easedY = ease(y - y0);

		const result = interpolate(
			interpolate(this.#gridDot(x, y, x0, y0), this.#gridDot(x, y, x1, y0), easedX),
			interpolate(this.#gridDot(x, y, x0, y1), this.#gridDot(x, y, x1, y1), easedX),
			easedY
		);

		return result;
	}
}

/**
 * Scale image data by given factors
 * @param {ImageData} imageData
 * @param {number} scaleX
 * @param {number} scaleY
 * @returns {ImageData}
 */
function scaleImageData(imageData, scaleX, scaleY) {
	const newCanvas = document.createElement("canvas");
	newCanvas.width = imageData.width;
	newCanvas.height = imageData.height;
	newCanvas.getContext("2d").putImageData(imageData, 0, 0);

	const scaleCanvas = document.createElement("canvas");
	scaleCanvas.width = innerWidth;
	scaleCanvas.height = innerHeight;
	const scaleCtx = scaleCanvas.getContext("2d");

	scaleCtx.scale(scaleX, scaleY);
	scaleCtx.drawImage(newCanvas, 0, 0);

	return scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height);
}

const COLOR = 0x012345;
const RED = COLOR >> 16;
const GREEN = (COLOR >> 8) & 0xff;
const BLUE = COLOR & 0xff;

export class PerlinBackground {
	#img;
	/**
	 * @param {number} seed
	 */
	constructor(seed) {
		const SIZE = 100;
		const canvas = document.createElement("canvas");
		canvas.width = SIZE;
		canvas.height = SIZE;
		const ctx = canvas.getContext("2d");
		const img = ctx.createImageData(SIZE, SIZE);
		const maxK = 6;
		const minK = 5;
		const random = seededRandom(seed);
		const noises = Array.from({ length: maxK - minK + 1 }, () => new PerlinNoise(random()));
		for (let i = 0; i < img.data.length; i += 4) {
			const j = i / 4;
			const x = j % SIZE;
			const y = (j - x) / SIZE;
			let factor = 0;
			for (let k = maxK; k >= minK; k--) {
				factor += noises[maxK - k].get(x / 2 ** k, y / 2 ** k) / 2 ** (maxK - k);
			}
			factor = 0.5 + factor;
			img.data[i] = RED * factor;
			img.data[i + 1] = GREEN * factor;
			img.data[i + 2] = BLUE * factor;
			img.data[i + 3] = 255;
		}

		this.#img = scaleImageData(img, innerWidth / SIZE, innerHeight / SIZE);
		addEventListener("resize", () => (this.#img = scaleImageData(img, innerWidth / SIZE, innerHeight / SIZE)));
	}

	/**
	 * Get the scaled background
	 * @returns {ImageData}
	 */
	getImageData() {
		return this.#img;
	}
}

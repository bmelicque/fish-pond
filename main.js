import { Fish } from "./src/Fish.js";
import FishElement from "./src/FishElement.js";
import { PerlinBackground } from "./src/perlin.js";
import { render, startWave } from "./src/shaders.js";
import Vec2 from "./src/Vector2.js";

function resize() {
	const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
	canvas.height = innerHeight;
	canvas.width = innerWidth;
}
addEventListener("resize", resize);
resize();

const fishes = new Array(100).fill(0).map(() => {
	const model = Fish.random();
	const view = new FishElement(model);
	return {
		model,
		view,
	};
});

let lastClick = performance.now();
const MAX_CLICK_INTERVAL = 167;
document.getElementById("canvas").addEventListener("click", (e) => {
	const now = performance.now();
	if (now - lastClick < MAX_CLICK_INTERVAL) return;
	lastClick = now;
	const scale = Math.max(innerWidth, innerHeight) / 100;
	const mouse = new Vec2(e.x / scale, e.y / scale);
	for (let fish of fishes) {
		fish.model.fleeFrom(mouse);
	}
	startWave(new Vec2(e.x / innerWidth, e.y / innerHeight));
});

/** @type {number|undefined} */
let lastTime = undefined;
document.addEventListener("visibilitychange", () => {
	lastTime = undefined;
});

const frameCanvas = document.createElement("canvas");
const frameCtx = frameCanvas.getContext("2d");
const background = new PerlinBackground(Math.random());

/**
 *
 * @param {number} elapsed
 */
function drawFrame(elapsed) {
	frameCanvas.height = innerHeight;
	frameCanvas.width = innerWidth;
	frameCtx.clearRect(0, 0, innerWidth, innerHeight);
	frameCtx.putImageData(background.getImageData(), 0, 0);

	const max =
		innerWidth > innerHeight
			? new Vec2(100, (innerHeight / innerWidth) * 100)
			: new Vec2(100 * (innerWidth / innerHeight), 100);

	for (let fish of fishes) {
		fish.model.move(elapsed, max);
		fish.view.drawFromChunks(frameCtx, fish.model.chunks);
	}
}

/**
 * @param {number} time
 */
function animate(time) {
	if (lastTime === undefined) {
		lastTime = time;
		requestAnimationFrame(animate);
		return;
	}
	const elapsed = time - lastTime;
	lastTime = time;
	drawFrame(elapsed);
	render(frameCanvas);
	requestAnimationFrame(animate);
}
animate(0);

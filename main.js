import { Fish } from "./src/Fish.js";
import FishElement from "./src/FishElement.js";
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

document.getElementById("canvas").addEventListener("click", (e) => {
	const mouse = new Vec2((e.x * 100) / innerWidth, (e.y * 100) / innerWidth);
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

/**
 *
 * @param {number} elapsed
 */
function drawFrame(elapsed) {
	frameCanvas.height = innerHeight;
	frameCanvas.width = innerWidth;
	frameCtx.clearRect(0, 0, innerWidth, innerHeight);

	for (let fish of fishes) {
		fish.model.move(elapsed, new Vec2(100, (innerHeight / innerWidth) * 100));
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

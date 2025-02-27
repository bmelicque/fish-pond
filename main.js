import { Fish } from "./src/Fish.js";
import FishElement from "./src/FishElement.js";
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
});

/** @type {number|undefined} */
let lastTime = undefined;
document.addEventListener("visibilitychange", () => {
	lastTime = undefined;
});

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
	const height = (innerHeight / innerWidth) * 100;

	const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let fish of fishes) {
		fish.model.move(elapsed, new Vec2(100, height));
		fish.view.drawFromChunks(ctx, fish.model.chunks);
	}
	requestAnimationFrame(animate);
}
animate(0);

import { Fish } from "./src/Fish.js";
import FishElement from "./src/FishElement.js";
import Vec2 from "./src/Vector2.js";

function resize() {
	const height = (innerHeight / innerWidth) * 100;
	document.getElementById("svg").setAttribute("viewBox", `0 0 100 ${height}`);
}
addEventListener("resize", resize);
resize();

const state = {
	mouse: new Vec2(),
};
document.getElementById("svg").addEventListener("mouseover", (e) => {
	state.mouse.x = (e.x * 100) / innerWidth;
	state.mouse.y = (e.y * 100) / innerWidth;
});

const fishes = new Array(30).fill(0).map(() => {
	const model = Fish.random();
	const view = new FishElement(model);
	document.getElementById("svg").appendChild(view.node);
	return {
		model,
		view,
	};
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
	for (let fish of fishes) {
		fish.model.move(elapsed, new Vec2(100, height), [state.mouse]);
		fish.view.updateFromChunks(fish.model.chunks);
	}
	requestAnimationFrame(animate);
}
animate(0);

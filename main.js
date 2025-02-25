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

const fishes = new Array(30).fill(0).map(() => Fish.random());
const elements = fishes.map((fish) => new FishElement(fish));
for (let fish of elements) {
	document.getElementById("svg")?.appendChild(fish.node);
}

function animate(time) {
	const height = (innerHeight / innerWidth) * 100;
	for (let i = 0; i < fishes.length; i++) {
		const fish = fishes[i];
		const element = elements[i];
		fish.time = time;
		fish.move(new Vec2(100, height), [state.mouse]);
		element.updateFromChunks(fish.chunks);
	}
	requestAnimationFrame(animate);
}
animate(0);

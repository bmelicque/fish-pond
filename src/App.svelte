<script module lang="ts">
	import { Fish } from "./lib/Fish";
	import FishElement from "./lib/FishElement";
	import Vec2 from "./lib/Vector2";

	let svgHeight = $state((innerHeight / innerWidth) * 100);
	const viewBox = $derived(`0 0 100 ${svgHeight}`);
	addEventListener("resize", () => {
		svgHeight = (innerHeight / innerWidth) * 100;
	});

	let mouse = $state(new Vec2());
	function handleMouse(e: MouseEvent) {
		mouse.x = (e.x * 100) / innerWidth;
		mouse.y = (e.y * 100) / innerWidth;
	}

	setTimeout(() => {
		const fishes = new Array(30).fill(0).map(() => Fish.random());
		const elements = fishes.map((fish) => new FishElement(fish));
		for (let fish of elements) {
			document.getElementById("svg")?.appendChild(fish.node);
		}

		function animate(time: number) {
			const height = (innerHeight / innerWidth) * 100;
			for (let i = 0; i < fishes.length; i++) {
				const fish = fishes[i];
				const element = elements[i];
				fish.time = time;
				fish.move(new Vec2(100, height), [mouse]);
				element.updateFromChunks(fish.chunks);
			}
			requestAnimationFrame(animate);
		}
		animate(0);
	});
</script>

<main>
	<svg id="svg" {viewBox} role="application" onmousemove={handleMouse}> </svg>
</main>

<style>
	#svg {
		width: 100vw;
		height: 100vh;
	}
</style>

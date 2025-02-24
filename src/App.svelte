<script module lang="ts">
	import FishElement from "./lib/FishElement.svelte";
	import { Fish } from "./lib/Fish.svelte";
	import Vec2 from "./lib/Vec2.svelte";

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

	function makeRandomFish() {
		const position = new Vec2(Math.random() * 100, Math.random() * svgHeight);
		const alpha = Math.random() * Math.PI * 2;
		const orientation = new Vec2(Math.cos(alpha), Math.sin(alpha));
		return new Fish(position, orientation);
	}

	let fishes = $state(new Array(30).fill(0).map(makeRandomFish));

	function animate(time: number) {
		const height = (innerHeight / innerWidth) * 100;
		for (let fish of fishes) {
			fish.time = time;
			fish.move(new Vec2(100, height), [mouse]);
		}
		requestAnimationFrame(animate);
	}
	animate(0);
</script>

<main>
	<svg id="svg" {viewBox} role="application" onmousemove={handleMouse}>
		{#each fishes as fish}
			<FishElement {fish} />
		{/each}
	</svg>
</main>

<style>
	#svg {
		width: 100vw;
		height: 100vh;
	}
</style>

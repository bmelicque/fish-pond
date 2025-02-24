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

	let fishes = $state(new Array(100).fill(0).map(makeRandomFish));
</script>

<main>
	<svg id="svg" {viewBox} role="application" onmousemove={handleMouse}>
		{#each fishes as fish}
			<FishElement {fish} obstacles={[mouse]} />
		{/each}
	</svg>
</main>

<style>
	#svg {
		width: 100vw;
		height: 100vh;
	}
</style>

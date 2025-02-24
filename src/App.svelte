<script module lang="ts">
	import FishElement from "./lib/FishElement.svelte";
	import { Fish } from "./lib/Fish.svelte";
	import Vec2 from "./lib/Vec2.svelte";

	export let svgHeight = $state((innerHeight / innerWidth) * 100);
	let viewBox = $derived(`0 0 100 ${svgHeight}`);

	// TODO:
	function resize() {}

	let fishes = $state([
		new Fish(new Vec2(5, 5)),
		new Fish(new Vec2(15, 5)),
		new Fish(new Vec2(25, 5)),
		new Fish(new Vec2(35, 5)),
		new Fish(new Vec2(45, 5)),
		new Fish(new Vec2(55, 5)),
		new Fish(new Vec2(65, 5)),
		new Fish(new Vec2(75, 5)),
		new Fish(new Vec2(85, 5)),
		new Fish(new Vec2(95, 5)),

		new Fish(new Vec2(5, 25)),
		new Fish(new Vec2(15, 25)),
		new Fish(new Vec2(25, 25)),
		new Fish(new Vec2(35, 25)),
		new Fish(new Vec2(45, 25)),
		new Fish(new Vec2(55, 25)),
		new Fish(new Vec2(65, 25)),
		new Fish(new Vec2(75, 25)),
		new Fish(new Vec2(85, 25)),
		new Fish(new Vec2(95, 25)),
	]);
</script>

<main>
	<svg id="svg" {viewBox} role="application">
		{#each fishes as fish}
			<FishElement {fish} />
		{/each}
	</svg>
</main>

<style>
	#svg {
		width: 100vw;
		height: 100vh;
		border: 1px solid white;
	}
</style>

<script module lang="ts">
	import FishElement from "./lib/FishElement.svelte";
	import { Fish } from "./lib/Fish.svelte";
	import Vec2 from "./lib/Vec2.svelte";

	export let svgHeight = $state((innerHeight / innerWidth) * 100);
	let viewBox = $derived(`0 0 100 ${svgHeight}`);

	// TODO:
	function resize() {}

	let fishes = $state([new Fish(new Vec2(5, 5)), new Fish(new Vec2(20, 10)), new Fish(new Vec2(40, 90))]);
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

<script lang="ts">
	import CaudalFin from "./CaudalFin.svelte";
	import DorsalFin from "./DorsalFin.svelte";
	import Fin from "./Fin.svelte";
	import { Chunk, Fish, NODE_DIST } from "./Fish.svelte";
	import Vec2 from "./Vec2.svelte";

	type Props = {
		fish: Fish;
		obstacles: Vec2[];
	};

	let { fish, obstacles }: Props = $props();

	const chunks: Chunk[] = $derived(fish.chunks);

	function animate(time: number) {
		if (fish.time === undefined) {
			fish.time = time;
			requestAnimationFrame(animate);
		}
		fish.time = time;
		const height = (innerHeight / innerWidth) * 100;
		fish.move(new Vec2(100, height), obstacles);
		requestAnimationFrame(animate);
	}
	animate(0);
</script>

<g>
	<CaudalFin {fish} />
	<Fin {fish} at={3} side={-1} length={1.5 * NODE_DIST} />
	<Fin {fish} at={3} side={1} length={1.5 * NODE_DIST} />
	<Fin {fish} at={9} side={-1} length={NODE_DIST} />
	<Fin {fish} at={9} side={1} length={NODE_DIST} />
	<path d={fish.getBodyPath()} fill={fish.color}> </path>
	<DorsalFin {fish} />
</g>

<style>
	path {
		/* fill: #ffa69e; */
		z-index: 1;
	}
</style>

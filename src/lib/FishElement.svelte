<script lang="ts">
	import CaudalFin from "./CaudalFin.svelte";
	import DorsalFin from "./DorsalFin.svelte";
	import Fin from "./Fin.svelte";
	import { Fish, NODE_DIST } from "./Fish.svelte";

	type Props = {
		fish: Fish;
	};

	let { fish }: Props = $props();
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
		z-index: 1;
	}
</style>

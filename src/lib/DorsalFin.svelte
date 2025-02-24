<script lang="ts">
	import type { Fish } from "./Fish.svelte";

	type Props = {
		fish: Fish;
	};

	let { fish }: Props = $props();
	const chunks = $derived(fish.chunks);

	function getPath() {
		const start = chunks[5].position;
		const end = chunks[9].position;
		const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
		const inner = chunks[7].position;
		const outer = { x: (inner.x - mid.x) * 3.5 + mid.x, y: (inner.y - mid.y) * 3.5 + mid.y };
		return `M${start.x},${start.y} Q${inner.x},${inner.y} ${end.x},${end.y} Q${outer.x},${outer.y} ${start.x},${start.y}`;
	}
</script>

<path d={getPath()} stroke={fish.color} fill={fish.color} />

<style>
	path {
		stroke-width: 0.1;
		filter: brightness(200%);
	}
</style>

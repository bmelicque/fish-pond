<script lang="ts">
	import { untrack } from "svelte";
	import Vec2 from "./Vec2.svelte";
	import { Chunk, Fish, NODE_DIST } from "./Fish.svelte";

	type Props = {
		fish: Fish;
	};

	let { fish }: Props = $props();
	const chunks = $derived(fish.chunks);

	function getCurvature(chunks: Chunk[]) {
		const orientations = new Array<Vec2>(chunks.length - 1);
		for (let i = 0; i < orientations.length; i++) {
			orientations[i] = Vec2.diff(chunks[i].position, chunks[i + 1].position);
		}
		return untrack(() => {
			const angles = new Array<number>(orientations.length - 1).fill(0);
			return angles.reduce((a, _, i) => a + Vec2.angle(orientations[i], orientations[i + 1]), 0) / angles.length;
		});
	}

	function getPath() {
		const start = chunks[chunks.length - 2].position;
		const mid = chunks[chunks.length - 1].position;
		const outerAngle = Vec2.angle(start, mid);
		return untrack(() => {
			const outerEnd = Vec2.diff(mid, start)
				.rotate(outerAngle)
				.resize(3 * NODE_DIST)
				.add(mid);
			const curvature = getCurvature(chunks);
			const innerEnd = Vec2.diff(mid, start)
				.rotate(outerAngle + 3 * curvature)
				.resize(3 * NODE_DIST)
				.add(mid);
			const firstEnd = { x: (2 * outerEnd.x + innerEnd.x) / 3, y: (2 * outerEnd.y + innerEnd.y) / 3 };
			const secondEnd = { x: (outerEnd.x + 2 * innerEnd.x) / 3, y: (outerEnd.y + 2 * innerEnd.y) / 3 };
			return `M${start.x},${start.y} Q${outerEnd.x},${outerEnd.y} ${firstEnd.x},${firstEnd.y} L${secondEnd.x},${secondEnd.y} Q${innerEnd.x},${innerEnd.y} ${start.x},${start.y}`;
		});
	}
</script>

<path d={getPath()} stroke={fish.color} fill={fish.color} />

<style>
	path {
		stroke-width: 0.1;
		filter: brightness(200%);
	}
</style>

<script lang="ts">
	import { untrack } from "svelte";
	import Vec2 from "./Vec2.svelte";
	import { Chunk, NODE_DIST } from "./Fish.svelte";

	// TODO: get angle from last two segments: used as outer shape for fin
	// TODO: get total curvature: used for inner shape of fin

	type Props = {
		chunks: Chunk[];
	};

	let { chunks }: Props = $props();

	function getCurvature(chunks: Chunk[]) {
		const orientations = new Array<Vec2>(chunks.length - 1);
		for (let i = 0; i < orientations.length; i++) {
			orientations[i] = Vec2.diff(chunks[i].position, chunks[i + 1].position);
		}
		return untrack(() => {
			const angles = new Array<number>(orientations.length - 1).fill(0);
			for (let i = 0; i < angles.length; i++) {
				if (isNaN(Vec2.angle(orientations[i], orientations[i + 1]))) {
					console.log("nan: ", Math.acos(Vec2.dot(orientations[i], orientations[i + 1])));
				}
			}
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
			// const outerEnd = { x: 3 * (mid.x - start.x) + start.x, y: 3 * (mid.y - start.y) + start.y };
			// const innerEnd = { x: 2 * (mid.x - ref.x) + ref.x, y: 3 * (mid.y - ref.y) + ref.y };
			return `M${start.x},${start.y} Q${outerEnd.x},${outerEnd.y} ${firstEnd.x},${firstEnd.y} L${secondEnd.x},${secondEnd.y} Q${innerEnd.x},${innerEnd.y} ${start.x},${start.y}`;
		});
	}
</script>

<path d={getPath()} />

<style>
	path {
		fill: white;
	}
</style>

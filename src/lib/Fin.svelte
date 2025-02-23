<script lang="ts">
	import { untrack } from "svelte";
	import Vec2 from "./Vec2.svelte";
	import { Chunk } from "./Fish.svelte";

	type Props = {
		chunks: Chunk[];
		/**
		 * Chunk index at which the fin is located
		 */
		at: number;
		/**
		 * Side of fish on which to put the fin.
		 * -1 for left, +1 for right
		 */
		side: number;
		length: number;
	};

	const { chunks, at, side, length }: Props = $props();
	const getFinAngle = () => {
		const segmentOrientation = Vec2.diff(chunks[at - 3].position, chunks[at - 1].position);
		return untrack(() => Vec2.angle(segmentOrientation, new Vec2(1)));
	};
	const finAngle = $derived(getFinAngle());

	const getFinPosition = () => {
		const segmentOrientation = Vec2.diff(chunks[at - 1].position, chunks[at + 1].position);
		return untrack(() => {
			return segmentOrientation
				.rotate((side * Math.PI) / 2)
				.resize(chunks[at].radius)
				.add(chunks[at].position);
		});
	};
	const finPosition = $derived(getFinPosition());
</script>

<!-- TODO: update transform-origin, should not be in the center -->
<ellipse
	cx={finPosition.x}
	cy={finPosition.y}
	rx={length}
	ry={length / 2}
	transform={`rotate(${(-finAngle * 180) / Math.PI - side * 30})`}
	transform-origin="50% 50%"
	style="transform-box: fill-box;"
/>

<style>
	ellipse {
		fill: white;
	}
</style>

<script lang="ts">
	import CaudalFin from "./CaudalFin.svelte";
	import DorsalFin from "./DorsalFin.svelte";
	import Fin from "./Fin.svelte";
	import { Chunk, Fish, NODE_DIST } from "./Fish.svelte";
	import Vec2 from "./Vec2.svelte";

	type Props = {
		fish: Fish;
	};

	let { fish }: Props = $props();

	const chunks: Chunk[] = $derived(fish.chunks);

	let lastTime: number | undefined = undefined;
	function animate(time: number) {
		if (lastTime === undefined) {
			lastTime = time;
			requestAnimationFrame(animate);
		}
		const delta = time - lastTime;
		lastTime = time;
		const speed = 0.01;
		const height = (innerHeight / innerWidth) * 100;
		fish.move(new Vec2(100, height), delta * speed);
		requestAnimationFrame(animate);
	}
	animate(0);
</script>

<g>
	<CaudalFin {chunks} />
	<Fin {chunks} at={3} side={-1} length={1.5 * NODE_DIST} />
	<Fin {chunks} at={3} side={1} length={1.5 * NODE_DIST} />
	<Fin {chunks} at={9} side={-1} length={NODE_DIST} />
	<Fin {chunks} at={9} side={1} length={NODE_DIST} />
	<path d={fish.getBodyPath()}> </path>
	<DorsalFin {chunks} />
</g>

<style>
	path {
		fill: #ffa69e;
		z-index: 1;
	}
</style>

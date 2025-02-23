<script lang="ts">
	import CaudalFin from "./CaudalFin.svelte";
	import DorsalFin from "./DorsalFin.svelte";
	import Fin from "./Fin.svelte";
	import { Chunk, Fish, NODE_DIST } from "./Fish.svelte";

	type Props = {
		fish: Fish;
	};

	let { fish }: Props = $props();

	const chunks: Chunk[] = $derived(fish.chunks);

	const DODGE_RADIUS = 2;

	let lastTime: number | undefined = undefined;
	function animate(time: number) {
		if (lastTime === undefined) {
			lastTime = time;
			requestAnimationFrame(animate);
		}
		const delta = time - lastTime;
		lastTime = time;
		const speed = 0.02;
		const target = fish.direction;
		if (fish.position.y < DODGE_RADIUS) {
			target.add(0, speed * delta);
		}
		const height = (innerHeight / innerWidth) * 100;
		if (fish.position.y > height - DODGE_RADIUS) {
			target.add(0, -speed * delta);
		}
		if (fish.position.x < DODGE_RADIUS) {
			target.add(speed * delta, 0);
		}
		if (fish.position.x > 100 - DODGE_RADIUS) {
			target.add(-speed * delta, 0);
		}
		target.resize(speed * delta);
		fish.position = fish.position.clone().add(target);
		requestAnimationFrame(animate);
	}
	animate(0);
</script>

<g>
	{#each fish.chunks as point}
		<circle cx={point.position.x} cy={point.position.y} r={point.radius}></circle>
	{/each}

	<CaudalFin {chunks} />
	<Fin {chunks} at={3} side={-1} length={1.5 * NODE_DIST} />
	<Fin {chunks} at={3} side={1} length={1.5 * NODE_DIST} />
	<Fin {chunks} at={9} side={-1} length={NODE_DIST} />
	<Fin {chunks} at={9} side={1} length={NODE_DIST} />
	<path d={fish.getBodyPath()}> </path>
	<DorsalFin {chunks} />
</g>

<style>
	circle {
		stroke-width: 0.5;
		/* stroke: white; */
		fill: none;
	}

	path {
		fill: #ffa69e;
		z-index: 1;
	}
</style>

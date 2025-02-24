import { untrack } from "svelte";
import Vec2 from "./Vec2.svelte";

export const NODE_DIST = 0.3;
const RADII = [1.36, 1.68, 1.74, 1.7, 1.66, 1.54, 1.28, 1.2, 1.02, 0.76, 0.68, 0.64, 0.38, 0.3, 0];

export class Chunk {
	readonly radius: number;
	position: Vec2; // already a $state

	constructor(radius: number, position = new Vec2()) {
		this.radius = radius;
		this.position = position;
	}
}

// TODO: make them part of instance? (could lead to different behaviors)
const DODGE_RADIUS = 15 * NODE_DIST;
const ALIGN_RADIUS = 1.2 * DODGE_RADIUS;
const APPROACH_RADIUS = 2 * DODGE_RADIUS;

const DODGE_FACTOR = 2;

const COLORS = ["#ffa69e", "#89a8b2", "#727d73"];

export class Fish {
	private static elements: Fish[] = [];

	readonly chunks: Chunk[];
	readonly speed: number = (NODE_DIST * RADII.length) / 1000;

	readonly color: string;

	#time: number | undefined;
	#delta: number = 0;

	constructor(position: Vec2, orientation: Vec2) {
		orientation.reverse().resize(NODE_DIST);
		this.chunks = RADII.map(
			(r, i) => new Chunk(r * NODE_DIST, new Vec2(position.x - i * orientation.x, position.y - i * orientation.y))
		);
		this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
		Fish.elements.push(this);
	}

	get time() {
		return this.#time;
	}

	set time(t) {
		if (t === undefined) return;
		if (this.#time) this.#delta = t - this.#time;
		this.#time = t;
	}

	get position() {
		return this.chunks[0].position;
	}

	set position(position: Vec2) {
		this.chunks[0].position = position;
		for (let i = 1; i < this.chunks.length; i++) {
			const prev = this.chunks[i - 1].position;
			this.chunks[i].position.sub(prev).resize(NODE_DIST).add(prev);
		}
	}

	get direction() {
		return Vec2.diff(this.chunks[0].position, this.chunks[1].position);
	}

	findNeighbours() {
		return Fish.elements
			.sort(
				(a, b) =>
					a.position.x + b.position.x - 2 * this.position.x + (a.position.y + b.position.y - 2 * this.position.y)
			)
			.slice(0, 6);
	}

	#getBodyPoints(chunks: Chunk[]) {
		const orientations = new Array<Vec2>(chunks.length - 1);
		for (let i = 0; i < orientations.length; i++) {
			orientations[i] = Vec2.diff(chunks[i].position, chunks[i + 1].position);
		}
		return untrack(() => {
			const head = orientations[0].clone().resize(chunks[0].radius).add(chunks[0].position);
			const lhs: Vec2[] = [head];
			const rhs: Vec2[] = [];

			lhs.push(
				orientations[0]
					.clone()
					.resize(chunks[0].radius)
					.rotate(Math.PI / 4)
					.add(chunks[0].position)
			);
			rhs.push(
				orientations[0]
					.clone()
					.resize(chunks[0].radius)
					.rotate(-Math.PI / 4)
					.add(chunks[0].position)
			);

			for (let i = 0; i < chunks.length - 1; i++) {
				lhs.push(orientations[i].ccwNormal().resize(chunks[i].radius).add(chunks[i].position));
				rhs.push(orientations[i].cwNormal().resize(chunks[i].radius).add(chunks[i].position));
			}

			lhs.push(chunks.at(-1)!.position);

			return lhs.concat(rhs.reverse());
		});
	}

	getBodyPath() {
		let points = this.#getBodyPoints(this.chunks);
		if (points.length < 3) return "";

		points.unshift(points[points.length - 3], points[points.length - 2], points[points.length - 1]);
		points.pop();
		points.pop();
		points.pop();

		let path = `M${points[0].x},${points[0].y}`;

		for (let i = 1; i < points.length; i += 3) {
			const p1 = points[i];
			const p2 = points[(i + 1) % points.length];
			const p3 = points[(i + 2) % points.length];

			path += ` C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
		}

		path += " Z";
		return path;
	}

	move(maxPosition: Vec2, obstacles: Vec2[]) {
		const distance = this.#delta * this.speed;
		const target = this.direction;
		if (this.position.y < DODGE_RADIUS) {
			target.add(0, distance);
		}
		if (this.position.y > maxPosition.y - DODGE_RADIUS) {
			target.add(0, -distance);
		}
		if (this.position.x < DODGE_RADIUS) {
			target.add(distance, 0);
		}
		if (this.position.x > maxPosition.x - DODGE_RADIUS) {
			target.add(-distance, 0);
		}

		let diff = new Vec2();

		for (let obstacle of obstacles) {
			diff.copy(obstacle).sub(this.position);
			if (diff.length < DODGE_RADIUS) {
				target.add(diff.reverse().resize(DODGE_FACTOR * distance));
			}
		}

		const neighbours = this.findNeighbours();
		for (let i = 0; i < neighbours.length; i++) {
			const neighbour = neighbours[i];
			diff.copy(neighbour.position).sub(this.position);
			const l = diff.length;
			if (l < Number.EPSILON) continue;
			const increment = distance * (1 - i / neighbours.length);
			if (l < DODGE_RADIUS) {
				target.add(diff.reverse().resize(DODGE_FACTOR * increment));
			} else if (l < ALIGN_RADIUS) {
				target.add(diff.copy(neighbour.direction).resize(increment));
			} else if (l < APPROACH_RADIUS) {
				target.add(diff.resize(increment));
			}
		}
		target.resize(distance);
		// reassign to trigger movement of the whole body
		this.position = this.position.add(target);
	}
}

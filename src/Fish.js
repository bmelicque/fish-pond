import Vec2 from "./Vector2.js";

export const NODE_DIST = 0.3;
const RADII = [1.36, 1.68, 1.74, 1.7, 1.66, 1.54, 1.28, 1.2, 1.02, 0.76, 0.68, 0.64, 0.38, 0.3, 0];

export class Chunk {
	#radius;
	position;

	/**
	 *
	 * @param {number} radius
	 * @param {Vec2} [position]
	 */
	constructor(radius, position = new Vec2()) {
		this.#radius = radius;
		this.position = position;
	}

	get radius() {
		return this.#radius;
	}
}

// TODO: make them part of instance? (could lead to different behaviors)
const DODGE_RADIUS = 15 * NODE_DIST;
const ALIGN_RADIUS = 1.2 * DODGE_RADIUS;
const APPROACH_RADIUS = 1.5 * DODGE_RADIUS;

const DODGE_FACTOR = 8;
const ALIGN_FACTOR = 1;
const APPROACH_FACTOR = 1;

const COLORS = ["#ffa69e", "#89a8b2", "#727d73"];

export class Fish {
	/** @type {Fish[]} */
	static #elements = [];
	static get elements() {
		return this.#elements;
	}

	// TODO: the 3 below should be readonly
	chunks;
	speed = (NODE_DIST * RADII.length) / 1000;
	color;

	/**
	 *
	 * @param {Vec2} position
	 * @param {Vec2} orientation
	 */
	constructor(position, orientation) {
		orientation.reverse().resize(NODE_DIST);
		this.chunks = RADII.map(
			(r, i) => new Chunk(r * NODE_DIST, new Vec2(position.x - i * orientation.x, position.y - i * orientation.y))
		);
		this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
		Fish.#elements.push(this);
	}

	/**
	 *
	 * @param {Vec2} maxPosition
	 * @returns
	 */
	static random(maxPosition = new Vec2(100, 100)) {
		const position = new Vec2(Math.random() * maxPosition.x, Math.random() * maxPosition.y);
		const alpha = Math.random() * Math.PI * 2;
		const orientation = new Vec2(Math.cos(alpha), Math.sin(alpha));
		return new Fish(position, orientation);
	}

	get position() {
		return this.chunks[0].position;
	}

	/**
	 * @param {Vec2} position
	 */
	set position(position) {
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
		return Fish.#elements
			.sort((a, b) => Vec2.sqrDist(this.position, a.position) - Vec2.sqrDist(this.position, b.position))
			.slice(0, 6);
	}

	/**
	 * @param {number} delta
	 * @param {Vec2} maxPosition
	 * @param {Vec2[]} obstacles
	 */
	move(delta, maxPosition, obstacles) {
		const distance = delta * this.speed;
		const target = this.direction.clone();
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
		for (let i = 1; i < neighbours.length; i++) {
			const neighbour = neighbours[i];
			const diff = Vec2.diff(neighbour.position, this.position);
			const l = diff.length;
			// const increment = distance * (1 - i / neighbours.length);
			const increment = distance;
			if (l < DODGE_RADIUS) {
				target.add(diff.reverse().resize(DODGE_FACTOR * increment));
			} else if (l < ALIGN_RADIUS) {
				target.add(diff.copy(neighbour.direction).resize(ALIGN_FACTOR * increment));
			} else if (l < APPROACH_RADIUS) {
				target.add(diff.resize(APPROACH_FACTOR * increment));
			}
		}
		// TODO: cap max angle (prevent weird redirections)
		target.resize(distance);
		// reassign to trigger movement of the whole body
		this.position = this.position.add(target);
	}
}

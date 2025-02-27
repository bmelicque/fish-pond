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
const ALIGN_RADIUS = 1 * DODGE_RADIUS;
const APPROACH_RADIUS = 1.5 * DODGE_RADIUS;

const DODGE_FACTOR = 1;
const ALIGN_FACTOR = 1;
const APPROACH_FACTOR = 1;

const MAX_REDIRECT_ANGLE = Math.PI / 8;

const COLORS = ["#ffa69e", "#89a8b2", "#727d73"];
export const LIGHTER_COLORS = {
	"#ffa69e": "#ffd5d1",
	"#89a8b2": "#c7d6da",
	"#727d73": "#a7aea7",
};

export class Fish {
	/** @type {Fish[]} */
	static #elements = [];
	static get elements() {
		return this.#elements;
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
		const color = COLORS[Math.floor(Math.random() * COLORS.length)];
		return new Fish(position, orientation, color);
	}

	/** The body chunks composing the fish */
	#chunks;
	/** The fish's color */
	#color;

	/**
	 * @param {Vec2} position
	 * @param {Vec2} orientation
	 * @param {string} [color]
	 */
	constructor(position, orientation, color = "white") {
		orientation.reverse().resize(NODE_DIST);
		this.#chunks = RADII.map(
			(r, i) => new Chunk(r * NODE_DIST, new Vec2(position.x - i * orientation.x, position.y - i * orientation.y))
		);
		this.#color = color;
		Fish.#elements.push(this);
	}

	get chunks() {
		return this.#chunks;
	}

	get position() {
		return this.chunks[0].position;
	}

	/**
	 * @param {Vec2} position
	 */
	set position(position) {
		this.chunks[0].position = position;
		let prev = position;
		for (let i = 1; i < this.chunks.length; i++) {
			const cur = this.chunks[i].position;
			cur.sub(prev).resize(NODE_DIST).add(prev);
			prev = cur;
		}
	}

	get direction() {
		return Vec2.diff(this.chunks[0].position, this.chunks[1].position);
	}

	get speed() {
		return (NODE_DIST * RADII.length) / 1000;
	}

	get color() {
		return this.#color;
	}

	/**
	 * Find the closest neighbours to `this` fish
	 * @returns {Fish[]} a list of neighbours
	 */
	findNeighbours(count = 6) {
		return Fish.#elements
			.sort((a, b) => Vec2.sqrDist(this.position, a.position) - Vec2.sqrDist(this.position, b.position))
			.slice(0, count);
	}

	/**
	 * Move the fish according to given constraints
	 * @param {number} delta how much time has elapsed since the last movement
	 * @param {Vec2} maxPosition the farthest the fish should go starting from (0,0)
	 * @param {Vec2[]} obstacles any obstacles
	 */
	move(delta, maxPosition, obstacles) {
		const distance = delta * this.speed;
		const target = this.direction.clone();

		// #region avoid borders
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
		// #endregion

		// #region avoid obstacles (mainly mouse)
		for (let obstacle of obstacles) {
			const diff = Vec2.diff(obstacle, this.position);
			if (diff.length < 2 * DODGE_RADIUS) {
				target.add(diff.reverse().resize(4 * DODGE_FACTOR * distance));
			}
		}
		// #endregion

		// #region adapt to neighboring fishes
		const neighbours = this.findNeighbours();
		for (let i = 1; i < neighbours.length; i++) {
			const neighbour = neighbours[i];
			const diff = Vec2.diff(neighbour.position, this.position);
			const l = diff.length;
			const increment = distance * (1 - i / neighbours.length);
			if (l < DODGE_RADIUS) {
				target.add(diff.reverse().resize(DODGE_FACTOR * increment));
			} else if (l < ALIGN_RADIUS) {
				target.add(diff.copy(neighbour.direction).resize(ALIGN_FACTOR * increment));
			} else if (l < APPROACH_RADIUS) {
				target.add(diff.resize(APPROACH_FACTOR * increment));
			}
		}
		// #endregion

		const angle = Vec2.angle(this.direction, target);
		let adjust = 0;
		if (angle > MAX_REDIRECT_ANGLE) adjust = angle - MAX_REDIRECT_ANGLE;
		if (angle < -MAX_REDIRECT_ANGLE) adjust = angle + MAX_REDIRECT_ANGLE;
		target.resize(distance).rotate(-adjust);
		// reassign to trigger movement of the whole body
		this.position = this.position.add(target);
	}
}

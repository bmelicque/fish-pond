export default class Vec2 {
	/** Unit vector along the x axis */
	static x = new Vec2(1);
	/** Unit vector along the y axis */
	static y = new Vec2(0, 1);

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	/**
	 * @returns {Vec2} a copy of this vector
	 */
	clone() {
		return new Vec2(this.x, this.y);
	}

	/**
	 * Copies the coordinates of `src` vector into `this` vector
	 * @param {Vec2} src
	 * @returns {Vec2} `this` vector
	 */
	copy(src) {
		this.x = src.x;
		this.y = src.y;
		return this;
	}

	/**
	 * Invert the sign of both coordinates in place
	 */
	reverse() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	/**
	 * Scale the vector by a given factor
	 * @param {number} factor
	 */
	scale(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	/**
	 * Resize the vector to a given length
	 * @param {number} length
	 */
	resize(length) {
		const scale = length / this.length;
		this.x *= scale;
		this.y *= scale;
		return this;
	}

	/**
	 * Rotate the vector by given angle
	 * @param {number} angle in radians
	 */
	rotate(angle) {
		const s = Math.sin(angle);
		const c = Math.cos(angle);
		const x = this.x;
		const y = this.y;
		this.x = x * c - y * s;
		this.y = x * s + y * c;
		return this;
	}

	/**
	 * Add given vector to `this`
	 * @overload
	 * @param {Vec2} value
	 * @returns {this}
	 */
	/**
	 * Add given coordinates to `this`
	 * @overload
	 * @param {number} x x-coordinate
	 * @param {number} y y-coordinate
	 * @returns {this}
	 */
	/**
	 * @param {Vec2|number} value
	 * @param {number} [y]
	 * @returns {this}
	 */
	add(value, y) {
		if (value instanceof Vec2) {
			this.x += value.x;
			this.y += value.y;
		} else if (y !== undefined) {
			this.x += value;
			this.y += y;
		}
		return this;
	}

	/**
	 *
	 * @param {Vec2} value
	 * @returns {this}
	 */
	sub(value) {
		this.x -= value.x;
		this.y -= value.y;
		return this;
	}

	/**
	 * Create a copy of the vector, rotated 90° clockwise.
	 * Also has less overhead than `.rotate()`.
	 * @returns {Vec2}
	 */
	cwNormal() {
		return new Vec2(this.y, -this.x);
	}

	/**
	 * Create a copy of the vector, rotated 90° counter-clockwise.
	 * Also has less overhead than `.rotate()`.
	 * @returns {Vec2}
	 */
	ccwNormal() {
		return new Vec2(-this.y, this.x);
	}

	/**
	 * Return the difference of given vectors as a new vector
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns {Vec2}
	 */
	static diff(a, b) {
		return new Vec2(a.x - b.x, a.y - b.y);
	}

	/**
	 * Compute the square of the difference between to vectors.
	 * Useful diff comparison, avoiding the overhead of Math.sqrt().
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns
	 */
	static sqrDist(a, b) {
		return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
	}

	/**
	 * Compute the dot product of the vectors.
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns {number}
	 */
	static dot(a, b) {
		return a.x * b.x + a.y * b.y;
	}

	/**
	 * Return the angle need for rotation from `a` to `b`
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns {number}
	 */
	static angle(a, b) {
		// float precision may lead the next part to be slightly > 1 (or < -1)
		// which is mathematically not possible and results in NaN acos()
		let tmp = Vec2.dot(a, b) / (a.length * b.length);
		if (tmp > 1 || tmp < -1) tmp = Math.sign(tmp);
		return Math.acos(tmp) * Math.sign(a.x * b.y - a.y * b.x);
	}

	/**
	 * Angle between 3 points of coordinates `a`, `b` and `c`
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @param {Vec2} c
	 * @returns
	 */
	static angle3(a, b, c) {
		const x1 = b.x - a.x;
		const y1 = b.y - a.y;
		const l1 = x1 ** 2 + y1 ** 2;
		const x2 = c.x - b.x;
		const y2 = c.y - b.y;
		const l2 = x2 ** 2 + y2 ** 2;
		return Math.acos((x1 * x2 + y1 * y2) / Math.sqrt(l1 * l2)) * Math.sign(a.x * b.y - a.y * b.x);
	}
}

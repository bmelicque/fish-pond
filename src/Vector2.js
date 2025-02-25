export default class Vec2 {
	static x = new Vec2(1);
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

	reverse() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	/**
	 * @param {number} factor
	 * @returns
	 */
	scale(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	/**
	 *
	 * @param {number} length
	 * @returns
	 */
	resize(length) {
		const scale = length / this.length;
		this.x *= scale;
		this.y *= scale;
		return this;
	}

	/**
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
	 * @overload
	 * @param {Vec2} value
	 * @returns {Vec2}
	 */
	/**
	 * @overload
	 * @param {number} x
	 * @param {number} y
	 * @returns {Vec2}
	 */
	/**
	 * @param {Vec2|number} value
	 * @param {number} [y]
	 * @returns {Vec2}
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
	 * @returns
	 */
	sub(value) {
		this.x -= value.x;
		this.y -= value.y;
		return this;
	}

	cwNormal() {
		return new Vec2(this.y, -this.x);
	}

	ccwNormal() {
		return new Vec2(-this.y, this.x);
	}

	/**
	 *
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns
	 */
	static diff(a, b) {
		return new Vec2(a.x - b.x, a.y - b.y);
	}

	/**
	 *
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns
	 */
	static sqrDist(a, b) {
		return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
	}

	/**
	 *
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns
	 */
	static dot(a, b) {
		return a.x * b.x + a.y * b.y;
	}

	/**
	 *
	 * @param {Vec2} a
	 * @param {Vec2} b
	 * @returns
	 */
	static angle(a, b) {
		// float operations may lead the next part to be slightly > 1
		// which is mathematically not possible and results in NaN acos()
		let tmp = Vec2.dot(a, b) / (a.length * b.length);
		if (tmp > 1 || tmp < -1) tmp = Math.sign(tmp);
		return Math.acos(tmp) * Math.sign(a.x * b.y - a.y * b.x);
	}

	/**
	 * Agnle between 3 points
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

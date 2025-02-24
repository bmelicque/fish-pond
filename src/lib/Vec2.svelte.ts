export default class Vec2 {
	x = $state(0);
	y = $state(0);

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	copy(src: Vec2) {
		this.x = src.x;
		this.y = src.y;
		return this;
	}

	reverse() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	resize(length: number) {
		const scale = length / this.length;
		this.x *= scale;
		this.y *= scale;
		return this;
	}

	scale(value: number) {
		this.x *= value;
		this.y *= value;
		return this;
	}

	/**
	 * @param angle in radians
	 */
	rotate(angle: number) {
		const s = Math.sin(angle);
		const c = Math.cos(angle);
		const x = this.x;
		const y = this.y;
		this.x = x * c - y * s;
		this.y = x * s + y * c;
		return this;
	}

	add(value: Vec2): Vec2;
	add(x: number, y: number): Vec2;
	add(value: Vec2 | number, y?: number) {
		if (value instanceof Vec2) {
			this.x += value.x;
			this.y += value.y;
		} else {
			this.x += value;
			this.y += y!;
		}
		return this;
	}

	sub(value: Vec2) {
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

	static diff(a: Vec2, b: Vec2) {
		return new Vec2(a.x - b.x, a.y - b.y);
	}

	static dot(a: Vec2, b: Vec2): number {
		return a.x * b.x + a.y * b.y;
	}

	static angle(a: Vec2, b: Vec2): number {
		// float operations may lead the next part to be slightly > 1
		// which is mathematically not possible and results in NaN acos()
		let tmp = Vec2.dot(a, b) / (a.length * b.length);
		if (tmp > 1 || tmp < -1) tmp = Math.sign(tmp);
		return Math.acos(tmp) * Math.sign(a.x * b.y - a.y * b.x);
	}

	/**
	 * Angle between 3 points
	 */
	static angle3(a: Vec2, b: Vec2, c: Vec2): number {
		const x1 = b.x - a.x;
		const y1 = b.y - a.y;
		const l1 = x1 ** 2 + y1 ** 2;
		const x2 = c.x - b.x;
		const y2 = c.y - b.y;
		const l2 = x2 ** 2 + y2 ** 2;
		return Math.acos((x1 * x2 + y1 * y2) / Math.sqrt(l1 * l2)) * Math.sign(a.x * b.y - a.y * b.x);
	}
}

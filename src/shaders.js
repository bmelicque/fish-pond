import Vec2 from "./Vector2.js";

const canvasGL = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const gl = canvasGL.getContext("webgl");

const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  varying vec2 v_texcoord;

  void main() {
    gl_Position = a_position;
    v_texcoord = a_texcoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;
  uniform vec2 aspect;
  uniform vec3 waves[60];
  uniform int waveCount;

  const float maxRadius = 0.25;

  float getDistortionStrength(vec2 dir, float time) {
    float d = length(dir) - time * maxRadius;
    d *= 1. - smoothstep(0., 0.02, abs(d));

    d *= smoothstep(0., 0.05, time);
    d *= 1. - smoothstep(0.5, 1., time);
    return d;
  }

  vec2 getOffset(vec2 pos, float time) {
    vec2 dir = pos - v_texcoord;

    float d = getDistortionStrength(dir*aspect, time);
    dir = normalize(dir);
    return dir * d;
  }

  void main() {
    vec2 offset;

    for (int i = 0; i < 6; i++) {
        offset += getOffset(waves[i].xy, waves[i].z);
    }

    vec4 color = texture2D(u_texture, v_texcoord + offset);
    gl_FragColor = color;
  }
`;

/**
 * Create a shader from given source
 * @param {WebGLRenderingContext} gl
 * @param {GLenum} type `gl.VERTEX_SHADER|gl.FRAGMENT_SHADER`
 * @param {string} source the GLSL source code for the shader
 * @returns
 */
function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader compile error:", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error("Program link error:", gl.getProgramInfoLog(program));
}

// Create a texture from the 2D canvas
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// Set texture parameters
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
const texcoords = [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0];

// Set up buffers
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

/**
 * @typedef Wave
 * @property {Vec2} center
 * @property {number} duration
 */

/** @type {Wave[]} */
let waves = [];

/**
 * Start a wave at given coordinates
 * @param {Vec2} at
 */
export function startWave(at) {
	waves.push({
		center: at,
		duration: 0,
	});
}

let now = performance.now();

/**
 * Render WebGL canvas using 2D canvas
 * @param {HTMLCanvasElement} canvas2D
 */
export function render(canvas2D) {
	canvasGL.width = innerWidth;
	canvasGL.height = innerHeight;
	gl.viewport(0, 0, canvasGL.width, canvasGL.height);

	// Clear canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Update the texture with the current state of the 2D canvas
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas2D);

	// Use the shader program
	gl.useProgram(program);

	// Set up attributes
	const positionLocation = gl.getAttribLocation(program, "a_position");
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.enableVertexAttribArray(texcoordLocation);
	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

	// Set texture uniform
	const textureLocation = gl.getUniformLocation(program, "u_texture");
	gl.uniform1i(textureLocation, 0);

	const aspectLocation = gl.getUniformLocation(program, "aspect");
	gl.uniform2f(aspectLocation, 1, innerHeight / innerWidth);

	const delta = performance.now() - now;
	now += delta;
	waves.forEach((wave) => (wave.duration += delta / 1000));
	waves = waves.filter((wave) => wave.duration < 1);
	const wavesLocation = gl.getUniformLocation(program, "waves");
	// cannot send an empty array
	const glWaves = new Array(6 * 3).fill(-1);
	for (let i = 0; i < waves.length; i++) {
		glWaves[3 * i] = waves[i].center.x;
		glWaves[3 * i + 1] = waves[i].center.y;
		glWaves[3 * i + 2] = waves[i].duration;
	}
	gl.uniform3fv(wavesLocation, glWaves);
	const waveCountLocation = gl.getUniformLocation(program, "waveCount");
	gl.uniform1i(waveCountLocation, waves.length);

	// Draw
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

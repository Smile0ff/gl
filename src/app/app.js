import { ShaderProgram } from '../utils';

import { Vector2D } from '../math/vector2D';
import { m2D } from '../math/matrix2D';

import { Triangle } from '../objects/2D/triangle';

export class App {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.gl = this.canvas.getContext('webgl');

    this._init();

    this.state = {
      objects: [],
    };
    this.angle = 0;
    this.scale = 1;
    this.scaleFactor = 0;
  }

  async _init() {
    this._setSize();
    this._clearColor();
    this._initListeners();


    const shaderProgram = await ShaderProgram.load({
      vertex: '../shaders/vertex-shader',
      fragment: '../shaders/fragment-shader',
    });
    const vertexShaderResource = await import('../shaders/vertex-shader');
    const fragmentShaderResource = await import('../shaders/fragment-shader');

    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.gl.shaderSource(vertexShader, vertexShaderResource.default);
    this.gl.shaderSource(fragmentShader, fragmentShaderResource.default);

    this.gl.compileShader(vertexShader);
    this.gl.compileShader(fragmentShader);

    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS))
      throw new Error('Shaders: vertex shader compilation error: ', this.gl.getShaderInfoLog(vertexShader));

    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS))
      throw new Error('Shaders: fragment shader compilation error: ', this.gl.getShaderInfoLog(fragmentShader));

    this.program = this.gl.createProgram();

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);

    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
      throw new Error('Program: program lint error: ', this.gl.getProgramInfoLog(this.program));

    this.gl.validateProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS))
      throw new Error('Program: program lint error: ', this.gl.getProgramInfoLog(this.program));

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      100, 0,
      0, 100,
    ]), this.gl.STATIC_DRAW);

    this.colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

    const r1 = Math.random() * 256;
    const g1 = Math.random() * 256;
    const b1 = Math.random() * 256;

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint8Array([
      r1, g1, b1, 255,
      r1, g1, b1, 255,
      r1, g1, b1, 255,
    ]), this.gl.STATIC_DRAW);

    this.verticesPositionLocation = this.gl.getAttribLocation(this.program, 'verticesPosition');
    this.colorLocation = this.gl.getAttribLocation(this.program, 'color');
    this.matrixLocation = this.gl.getUniformLocation(this.program, 'matrix');

    this._render();
  }

  _clearColor() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  _setSize() {
    this.gl.canvas.width = window.innerWidth;
    this.gl.canvas.height = window.innerHeight;
  }

  _initListeners() {
    window.addEventListener('resize', () => this._setSize(), false);
  }

  _render() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this._clearColor();

    this.gl.useProgram(this.program);

    this.gl.enableVertexAttribArray(this.verticesPositionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(this.verticesPositionLocation, 2, this.gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

    this.gl.enableVertexAttribArray(this.colorLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.vertexAttribPointer(this.colorLocation, 4, this.gl.UNSIGNED_BYTE, true, 4 * Uint8Array.BYTES_PER_ELEMENT, 0);

    this.angle += 0.3;
    this.scale += this.scaleFactor;

    if (this.scale <= 1) this.scaleFactor += .01;
    if (this.scale >= 3) this.scaleFactor -= .01;

    let matrix = m2D.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);

    const cw = this.gl.canvas.clientWidth / 2;
    const ch = this.gl.canvas.clientHeight / 2;

    matrix = m2D.translate(matrix, cw, ch);

    matrix = m2D.rotate(matrix, this.angle);
    matrix = m2D.translate(matrix, 150 * this.scale, 150 * this.scale);

    matrix = m2D.scale(matrix, this.scale, this.scale);

    matrix = m2D.translate(matrix, -50, -50);

    this.gl.uniformMatrix3fv(this.matrixLocation, false, matrix);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

    window.requestAnimationFrame(this._render.bind(this));
  }
}

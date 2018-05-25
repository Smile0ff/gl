import { Shaders, createProgram } from '../engine';
import { Vector2D } from '../math/vector2D';
import { Triangle } from '../objects/2D/triangle';

export class App {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.gl = this.canvas.getContext('webgl');

    this._init();

    this.state = {
      objects: [],
    };
  }

  async _init() {
    this._setSize();
    this._clearColor();
    this._initListeners();

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

    for (let i = 0; i < 10; i++) {
      const triangle = new Triangle(
        this.gl,
        this.program,
        new Vector2D(0.5, 0.5),
        new Vector2D(-0.5, -0.5),
        new Vector2D(0.5, 0.5),
      );

      this.state.objects.push(triangle);
    }

    this._render();
  }

  _clearColor() {
    this.gl.clearColor(0, 0, 0, 1);
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

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);

    this._clearColor();

    this.gl.useProgram(this.program);

    this.state.objects.forEach((object) => {
      object.render();
    });

    // this.gl.enableVertexAttribArray(this.verticesPosition);

    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleBuffer);
    // this.gl.vertexAttribPointer(this.verticesPosition, 2, this.gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

    // this.gl.uniform4fv(this.color, [.4, .1, .3, .4]);

    // this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVerticesCount);

    window.requestAnimationFrame(this._render.bind(this));
  }
}

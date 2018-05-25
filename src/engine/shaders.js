export class Shaders {
  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    this._create(gl, vertexShaderSource, fragmentShaderSource);
    this._compile(gl);
  }

  static async build(gl) {
    const vertexShader = await import('../shaders/vertex-shader');
    const fragmentShader = await import('../shaders/fragment-shader');

    return new Shaders(gl, vertexShader.default, fragmentShader.default);
  }

  _create(gl, vertexShaderSource, fragmentShaderSource) {
    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(this.vertexShader, vertexShaderSource);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource);
  }

  _compile(gl) {
    gl.compileShader(this.vertexShader);
    gl.compileShader(this.fragmentShader);

    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS))
      throw new Error('Shaders: vertex shader compilation error: ', gl.getShaderInfoLog(this.vertexShader));

    if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS))
      throw new Error('Shaders: fragment shader compilation error: ', gl.getShaderInfoLog(this.fragmentShader));

    return {
      vertex: this.vertexShader,
      fragment: this.fragmentShader,
    };
  }
}

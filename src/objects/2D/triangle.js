import { Vector2D } from '../../math/vector2D';

const uniformTypeBinding = (gl, program, uniformInfo) => {
  const { type, name } = uniformInfo;
  const location = gl.getUniformLocation(program, name);

  if (type === gl.FLOAT_VEC2) {
    return (v) => {
      gl.uniform2fv(location, v);
    }
  }

  if (type === gl.FLOAT_VEC3) {
    return (v) => {
      gl.uniform3fv(location, v);
    }
  }

  if (type === gl.FLOAT_VEC4) {
    return (v) => {
      gl.uniform4fv(location, v);
    }
  }
}

export class Triangle {
  constructor(gl, program, a = new Vector2D(), b = new Vector2D(), c = new Vector2D()) {
    this.gl = gl;
    this.program = program;

    this.positionBuffer = null;
    this.colorBuffer = null;

    this.attrs = {};
    this.uniforms = {};

    this.vertices = [
      ...Object.values(a),
      ...Object.values(b),
      ...Object.values(c),
    ];

    this.colors = []

    this.size = 3;

    this.createBuffers();
    this.bindBuffer();
    this.fillBuffers();

    this.defineAttrs();
    this.defineUniforms();
  }

  createBuffer() {
    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
  }

  bindBuffer() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }

  fillBuffer() {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
  }

  defineAttrs() {
    const activeAttrs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < activeAttrs; i++) {
      const { type, name } = this.gl.getActiveAttrib(this.program, i);
      const attrLocation = this.gl.getAttribLocation(this.program, name);

      this.attrs[name] = attrLocation;
    }
  }

  defineUniforms() {
    const activeUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < activeUniforms; i++) {
      const uniformInfo = this.gl.getActiveUniform(this.program, i);
      this.uniforms[uniformInfo.name] = uniformTypeBinding(this.gl, this.program, uniformInfo);
    }
  }

  enableAttributes() {
    Object.keys(this.attrs).forEach((attrKey) => {
      this.gl.enableVertexAttribArray(this.attrs[attrKey]);
    });
  }

  updateAttrs() {
    Object.keys(this.attrs).forEach((attrKey) => {
      this.gl.vertexAttribPointer(this.attrs[attrKey], 2, this.gl.FLOAT, false, 0, 0);
    });
  }

  updateUniforms() {
    this.uniforms.color([Math.random(), Math.random(), Math.random(), 1.0]);
  }

  render() {
    this.enableAttributes();
    this.updateAttrs();

    this.bindBuffer();

    this.updateUniforms();

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.size);
  }
}

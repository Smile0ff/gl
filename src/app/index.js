const surface = document.querySelector('#surface');
const gl = surface.getContext('webgl') || surface.getContext('experimental-webgl');

const setSize = () => {
  surface.width = window.innerWidth;
  surface.height = window.innerHeight;
}

const resize = () => setSize();

const createShader = (type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!success) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return;
  }

  return shader;
};

const createProgram = (vertex, fragment) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  return program;
};

const setSquare = (x1, y1, w, h) => {
  const x2 = x1 + w;
  const y2 = y1 + h;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
};

const app = async () => {
  const vertexShaderSource = await import('../shaders/vertex-shader');
  const fragmentShaderSource = await import('../shaders/fragment-shader');

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource.default);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource.default);

  const program = createProgram(vertexShader, fragmentShader);

  const position = gl.getAttribLocation(program, 'a_position');

  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const color = gl.getUniformLocation(program, 'u_color');

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(position);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 1 - position
  // 2 - size
  // 3 - type
  // 4 - normalize
  // 5 - stride
  // 6 - offset
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resolution, gl.canvas.width, gl.canvas.height);
  gl.uniform4f(color, Math.random(), Math.random(), Math.random(), 1);

  for (let i = 0; i < 10; i++) {
    setSquare(
      Math.floor(Math.random() * 300),
      Math.floor(Math.random() * 300),
      Math.floor(Math.random() * 300),
      Math.floor(Math.random() * 300),
    );

    gl.uniform4f(color, Math.random(), Math.random(), Math.random(), 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

setSize();
window.addEventListener('load', app, false);
window.addEventListener('resize', resize, false);

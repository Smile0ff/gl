export const createProgram = (gl, shaders) => {
  const program = gl.createProgram();

  gl.attachShader(program, shaders.vertexShader);
  gl.attachShader(program, shaders.fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error('Program: program lint error: ', gl.getProgramInfoLog(program));

  gl.validateProgram(program);

  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
    throw new Error('Program: program lint error: ', gl.getProgramInfoLog(program));

  return program;
};

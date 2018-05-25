precision mediump float;

attribute vec2 verticesPosition;

void main() {
  gl_Position = vec4(verticesPosition, 0.0, 1.0);
}

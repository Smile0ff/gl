attribute vec2 verticesPosition;
attribute vec4 color;

uniform mat3 matrix;

varying vec4 fragmentColor;

void main() {
  vec2 position = (matrix * vec3(verticesPosition, 1.0)).xy;

  gl_Position = vec4(position, 0, 1);

  fragmentColor = color;
}

export class ShaderProgram {
  constructor(gl) {


  }

  static async load({ vertex, fragment }) {
    console.log(vertex)
    const vertexSource = await import('' + vertex);

    console.log(vertexSource);
  }

}

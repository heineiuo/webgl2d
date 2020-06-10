import * as m4 from './m4'
import { createProgramFromString } from './WebglUtils'

const fragmentShader = `precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}`

const vertexShader = `attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
   gl_Position = u_matrix * a_position;
   v_texcoord = a_texcoord;
}`

// Unlike images, textures do not have a width and height associated
// with them so we'll pass in the width and height of the texture
export function drawImage(tex, texWidth, texHeight, dstX, dstY) {
  const { gl } = this
  gl.bindTexture(gl.TEXTURE_2D, tex)

  const program = createProgramFromString(gl, [
    { shaderSource: vertexShader, shaderType: 'VERTEX_SHADER' },
    { shaderSource: fragmentShader, shaderType: 'FRAGMENT_SHADER' },
  ])
  // Tell WebGL to use our shader program pair
  gl.useProgram(program)

  // new

  // Create a buffer.
  var positionBuffer = gl.createBuffer()
  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, 'a_position')
  var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord')

  // Create a buffer for texture coords
  var texcoordBuffer = gl.createBuffer()

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, 'u_matrix')
  var textureLocation = gl.getUniformLocation(program, 'u_texture')

  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.enableVertexAttribArray(texcoordLocation)
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)

  // this matirx will convert from pixels to clip space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1)

  // this matrix will translate our quad to dstX, dstY
  matrix = m4.translate(matrix, dstX, dstY, 0)

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.scale(matrix, texWidth, texHeight, 1)

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix)

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0)

  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

export class DrawImage implements CanvasDrawImage {}

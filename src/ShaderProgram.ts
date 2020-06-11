export class ShaderProgram extends WebGLProgram {
  stackDepth?: number
  vertexPositionAttribute?: number
  uColor?: WebGLUniformLocation | null
  uSampler?: WebGLUniformLocation | null
  uCropSource?: WebGLUniformLocation | null
  uTransforms?: (WebGLUniformLocation | null)[]
}

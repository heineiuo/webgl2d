export class InternalState {
  constructor(webgl: WebGLRenderingContext) {
    this.webgl = webgl
    this.drawStateStack = []
  }
  webgl: WebGLRenderingContext

  drawStateStack: any[]
}

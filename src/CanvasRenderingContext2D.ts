import { InternalState } from './InternalState'
import { Transformer } from './Transformer'
import {
  getFragmentShaderSource,
  getVertexShaderSource,
  SubPath,
} from './Utils'
import { ShaderProgram } from './ShaderProgram'

export class CanvasRenderingContext2DImplemention
  implements CanvasRenderingContext2D {
  constructor(webgl: WebGLRenderingContext) {
    this.internalState = new InternalState(webgl)
    this.transformer = new Transformer([1])
    this.gl = webgl
  }

  private gl: WebGLRenderingContext
  private internalState: InternalState
  private transformer: Transformer
  private pathVertexPositionBuffer: WebGLBuffer
  private rectVertexPositionBuffer: WebGLBuffer
  private shaderPool = []
  private subPaths = []
  private shaderProgram!: WebGLProgram
  private imageCache = []
  private textureCache = []

  private sendTransformStack(sp: ShaderProgram): void {
    const stack = this.transformer.matStack
    for (let i = 0, maxI = this.transformer.cStack + 1; i < maxI; ++i) {
      console.log([sp.uTransforms[i], false, stack[maxI - 1 - i]])
      this.gl.uniformMatrix3fv(sp.uTransforms[i], false, stack[maxI - 1 - i])
    }
  }

  private getShaderProgram = (
    transformStackDepth = 1,
    sMask = 0
  ): ShaderProgram => {
    const gl = this.gl
    const storedShader = this.shaderPool[transformStackDepth]
      ? this.shaderPool[transformStackDepth][sMask]
      : null
    if (storedShader) {
      gl.useProgram(storedShader)
      this.shaderProgram = storedShader
      return storedShader
    }
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(fragmentShader, getFragmentShaderSource(sMask))
    gl.compileShader(fragmentShader)

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(
        'fragment shader error: ' + gl.getShaderInfoLog(fragmentShader)
      )
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(
      vertexShader,
      getVertexShaderSource(
        transformStackDepth,
        sMask,
        this.internalState.canvasWidth,
        this.internalState.canvasHeight
      )
    )
    gl.compileShader(vertexShader)

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw 'vertex shader error: ' + gl.getShaderInfoLog(vertexShader)
    }

    const shaderProgram: ShaderProgram = gl.createProgram()
    shaderProgram.stackDepth = transformStackDepth
    gl.attachShader(shaderProgram, fragmentShader)
    gl.attachShader(shaderProgram, vertexShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw 'Could not initialise shaders.'
    }

    gl.useProgram(shaderProgram)

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
      shaderProgram,
      'aVertexPosition'
    )
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)

    shaderProgram.uColor = gl.getUniformLocation(shaderProgram, 'uColor')
    shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, 'uSampler')
    shaderProgram.uCropSource = gl.getUniformLocation(
      shaderProgram,
      'uCropSource'
    )

    shaderProgram.uTransforms = []
    for (let i = 0; i < transformStackDepth; ++i) {
      shaderProgram.uTransforms[i] = gl.getUniformLocation(
        shaderProgram,
        'uTransforms[' + i + ']'
      )
    }
    if (!this.shaderPool[transformStackDepth]) {
      this.shaderPool[transformStackDepth] = []
    }
    this.shaderPool[transformStackDepth][sMask] = shaderProgram
    return shaderProgram
  }

  private fillSubPath(index: number): void {
    const transform = this.transformer
    const shaderProgram = this.getShaderProgram(transform.cStack + 2, 0)

    const subPath = this.subPaths[index]
    const verts = subPath.verts

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pathVertexPositionBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(verts),
      this.gl.STATIC_DRAW
    )

    this.gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      4,
      this.gl.FLOAT,
      false,
      0,
      0
    )

    transform.pushMatrix()

    this.sendTransformStack(shaderProgram)

    const fillStyle = this.internalState.fillStrokeStyles.fillStyle

    this.gl.uniform4f(
      shaderProgram.uColor,
      fillStyle[0],
      fillStyle[1],
      fillStyle[2],
      fillStyle[3]
    )

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, verts.length / 4)

    transform.popMatrix()
  }

  private strokeSubPath(index: number): void {
    const transformer = this.transformer
    const shaderProgram = this.getShaderProgram(transformer.cStack + 2, 0)

    const subPath = this.subPaths[index]
    const verts = subPath.verts

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pathVertexPositionBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(verts),
      this.gl.STATIC_DRAW
    )

    this.gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      4,
      this.gl.FLOAT,
      false,
      0,
      0
    )

    transformer.pushMatrix()

    this.sendTransformStack(shaderProgram)
    const strokeStyle = this.internalState.fillStrokeStyles.strokeStyle

    this.gl.uniform4f(
      shaderProgram.uColor,
      strokeStyle[0],
      strokeStyle[1],
      strokeStyle[2],
      strokeStyle[3]
    )

    if (subPath.closed) {
      this.gl.drawArrays(this.gl.LINE_LOOP, 0, verts.length / 4)
    } else {
      this.gl.drawArrays(this.gl.LINE_STRIP, 0, verts.length / 4)
    }

    transformer.popMatrix()
  }

  // ------------------ END OF PRIVATE METHODS --------------------------------------

  get canvas(): HTMLCanvasElement {
    return null
  }

  get globalAlpha(): number {
    return this.internalState.compositing.globalAlpha
  }

  set globalAlpha(value) {
    this.internalState.compositing.globalAlpha = value
  }

  get globalCompositeOperation(): string {
    return this.internalState.compositing.globalCompositeOperation
  }

  set globalCompositeOperation(value) {
    this.internalState.compositing.globalCompositeOperation = value
  }

  get fillStyle(): string | CanvasGradient | CanvasPattern {
    return this.internalState.fillStrokeStyles.fillStyle
  }

  set fillStyle(value) {
    this.internalState.fillStrokeStyles.fillStyle = value
  }

  get strokeStyle(): string | CanvasGradient | CanvasPattern {
    return this.internalState.fillStrokeStyles.strokeStyle
  }

  set strokeStyle(value) {
    this.internalState.fillStrokeStyles.strokeStyle = value
  }

  get filter(): string {
    return this.internalState.filter
  }

  set filter(value) {
    this.internalState.filter = value
  }

  get imageSmoothingEnabled(): boolean {
    return this.internalState.imageSmoothing.imageSmoothingEnabled
  }

  set imageSmoothingEnabled(value) {
    this.internalState.imageSmoothing.imageSmoothingEnabled = value
  }

  get imageSmoothingQuality(): ImageSmoothingQuality {
    return this.internalState.imageSmoothing.imageSmoothingQuality
  }

  set imageSmoothingQuality(value) {
    this.internalState.imageSmoothing.imageSmoothingQuality = value
  }

  get lineWidth(): number {
    return this.internalState.drawingStyles.lineWidth
  }

  set lineWidth(value) {
    // this.gl.$lineWidth(value)
    this.internalState.drawingStyles.lineWidth = value
  }

  get lineDashOffset(): number {
    return this.internalState.drawingStyles.lineDashOffset
  }

  set lineDashOffset(value) {
    this.internalState.drawingStyles.lineDashOffset = value
  }

  // Currently unsupported attributes and their default values
  get lineCap(): CanvasLineCap {
    return this.internalState.drawingStyles.lineCap
  }

  set lineCap(value) {
    this.internalState.drawingStyles.lineCap = value
  }

  get lineJoin(): CanvasLineJoin {
    return this.internalState.drawingStyles.lineJoin
  }

  set lineJoin(value) {
    this.internalState.drawingStyles.lineJoin = value
  }

  get miterLimit(): number {
    return this.internalState.drawingStyles.miterLimit
  }

  set miterLimit(value) {
    this.internalState.drawingStyles.miterLimit = value
  }

  get shadowOffsetX(): number {
    return this.internalState.shadowStyles.shadowOffsetX
  }

  set shadowOffsetX(value) {
    this.internalState.shadowStyles.shadowOffsetX = value
  }

  get shadowOffsetY(): number {
    return this.internalState.shadowStyles.shadowOffsetY
  }

  set shadowOffsetY(value) {
    this.internalState.shadowStyles.shadowOffsetY = value
  }

  get shadowBlur(): number {
    return this.internalState.shadowStyles.shadowBlur
  }

  set shadowBlur(value) {
    this.internalState.shadowStyles.shadowBlur = value
  }

  get shadowColor(): string {
    return this.internalState.shadowStyles.shadowColor
  }

  set shadowColor(value) {
    this.internalState.shadowStyles.shadowColor = value
  }

  get font(): string {
    return this.internalState.textDrawingStyles.font
  }

  set font(value) {
    this.internalState.textDrawingStyles.font = value
  }

  get textAlign(): CanvasTextAlign {
    return this.internalState.textDrawingStyles.textAlign
  }

  set textAlign(value) {
    this.internalState.textDrawingStyles.textAlign = value
  }

  get textBaseline(): CanvasTextBaseline {
    return this.internalState.textDrawingStyles.textBaseline
  }

  set textBaseline(value) {
    this.internalState.textDrawingStyles.textBaseline = value
  }

  get direction(): CanvasDirection {
    return this.internalState.textDrawingStyles.direction
  }

  set direction(value) {
    this.internalState.textDrawingStyles.direction = value
  }

  isPointInStroke = (arg1: any, arg2: any, arg3?: any, arg4?: any): boolean => {
    console.warn('isPointInStroke not implemented')
    return false
  }

  ellipse = (
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): void => {
    console.warn('ellipse not implemented')
  }

  getLineDash = (): number[] => {
    console.warn('getLineDash not implemented')
    return []
  }

  drawImage = (
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ): void => {
    console.warn('drawImage not implemented')
  }

  // Empty the list of subpaths so that the context once again has zero subpaths
  beginPath = (): void => {
    this.subPaths = []
  }

  clip = (arg1?: any, arg2?: any): void => {
    console.warn('clip not implemented')
    return
  }

  fill = (arg1?: any, arg2?: any): void => {
    for (let i = 0; i < this.subPaths.length; i++) {
      this.fillSubPath(i)
    }
  }

  isPointInPath = (path: any, x: any, y?: any, fillRule?: any): boolean => {
    console.warn('isPointInPath not implemented')
    return false
  }

  stroke = (path?: Path2D): void => {
    for (let i = 0; i < this.subPaths.length; i++) {
      this.strokeSubPath(i)
    }

    this.gl.flush()
    // this.gl.endFrameEXP()
  }

  setLineDash = (segments: number[]): void => {
    console.warn('setLineDash not implemented')
    return
  }

  getTransform = (): DOMMatrix => {
    console.warn('getTransform not implemented')
    return {} as DOMMatrix
  }

  resetTransform = (): void => {
    return
  }

  drawFocusIfNeeded = (arg1: any, arg2?: any): void => {
    console.warn('drawFocusIfNeeded not implemented')
    return
  }

  scrollPathIntoView = (path?: Path2D): void => {
    console.warn('scrollPathIntoView not implemented')
    return
  }

  createLinearGradient = (
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient => {
    console.warn('createLinearGradient not implemented')
    return {} as CanvasGradient
  }

  createPattern = (
    image: CanvasImageSource,
    repetition: string
  ): CanvasPattern | null => {
    console.warn('createLinearGradient not implemented')
    return
  }

  createRadialGradient = (
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient => {
    console.warn('createLinearGradient not implemented')
    return {} as CanvasGradient
  }

  // Need a solution for drawing text that isnt stupid slow
  fillText = (text: string, x: number, y: number, maxWidth?: number): void => {
    /*
      textCtx.clearRect(0, 0, this.options.width, this.options.height);
      textCtx.fillStyle = gl.fillStyle;
      textCtx.fillText(text, x, y);

      gl.drawImage(textCanvas, 0, 0);
      */
  }

  strokeText = (
    text: string,
    x: number,
    y: number,
    maxWidth?: number
  ): void => {
    console.warn('strokeText not implemented')
  }

  measureText = (text: string): TextMetrics => {
    console.warn('measureText not implemented')
    return {} as TextMetrics
  }

  save = (): void => {
    this.transformer.pushMatrix()
    this.internalState.save()
  }

  restore = (): void => {
    this.transformer.popMatrix()
    this.internalState.restore()
  }

  translate = (x: number, y: number): void => {
    this.transformer.translate(x, y)
  }

  rotate = (angle: number): void => {
    this.transformer.rotate(angle)
  }

  scale = (x: number, y: number): void => {
    this.transformer.scale(x, y)
  }

  createImageData = (arg1: any, arg2?: any): ImageData => {
    // throw new Error('createImageData not implemented')
    // return this.tempCtx.createImageData(width, height);
    return new ImageData(arg1, arg2)
  }

  getImageData = (
    sx: number,
    sy: number,
    sw: number,
    sh: number
  ): ImageData => {
    throw new Error('getImageData not implemented')

    // let data = this.tempCtx.createImageData(width, height);
    // let buffer = new Uint8Array(width * height * 4);
    // this.gl.readPixels(sx, sy, sw, sh, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
    // let w = width * 4,
    //   h = height;
    // for (var i = 0, maxI = h / 2; i < maxI; ++i) {
    //   for (var j = 0, maxJ = w; j < maxJ; ++j) {
    //     let index1 = i * w + j;
    //     let index2 = (h - i - 1) * w + j;
    //     data.data[index1] = buffer[index2];
    //     data.data[index2] = buffer[index1];
    //   }
    // }
    // return data;
  }

  putImageData = (imageData, x, y): void => {
    this.drawImage(imageData, x, y)
  }

  transform = (m11, m12, m21, m22, dx, dy): void => {
    const m = this.transformer.matStack[this.transformer.cStack]

    m[0] *= m11
    m[1] *= m21
    m[2] *= dx
    m[3] *= m12
    m[4] *= m22
    m[5] *= dy
    m[6] = 0
    m[7] = 0
  }

  setTransform = (
    a?: any,
    b?: any,
    c?: any,
    d?: any,
    e?: any,
    f?: any
  ): void => {
    this.transformer.setIdentity()
    this.transform(a, b, c, d, e, f)
  }

  fillRect = (x: number, y: number, width: number, height: number): void => {
    const gl = this.gl
    const transformer = this.transformer
    const shaderProgram = this.getShaderProgram(transformer.cStack + 2, 0)
    console.log({ shaderProgram })

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectVertexPositionBuffer)
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      4,
      gl.FLOAT,
      false,
      0,
      0
    )

    transformer.pushMatrix()

    transformer.translate(x, y)
    transformer.scale(width, height)

    this.sendTransformStack(shaderProgram)
    const fillStyle = this.internalState.fillStrokeStyles.fillStyle

    gl.uniform4f(
      shaderProgram.uColor,
      fillStyle[0],
      fillStyle[1],
      fillStyle[2],
      fillStyle[3]
    )

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

    transformer.popMatrix()
  }

  strokeRect = (x: number, y: number, width: number, height: number): void => {
    const transform = this.transformer
    const shaderProgram = this.getShaderProgram(transform.cStack + 2, 0)
    const gl = this.gl

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectVertexPositionBuffer)
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      4,
      gl.FLOAT,
      false,
      0,
      0
    )

    transform.pushMatrix()

    transform.translate(x, y)
    transform.scale(width, height)

    this.sendTransformStack(shaderProgram)
    const strokeStyle = this.internalState.fillStrokeStyles.strokeStyle

    gl.uniform4f(
      shaderProgram.uColor,
      strokeStyle[0],
      strokeStyle[1],
      strokeStyle[2],
      strokeStyle[3]
    )

    gl.drawArrays(gl.LINE_LOOP, 0, 4)

    transform.popMatrix()
  }

  clearRect = (x: number, y: number, width: number, height: number): void => {
    console.warn('clearRect not implemented')
  }

  // Mark last subpath as closed and create a new subpath with the same starting point as the previous subpath
  closePath = (): void => {
    const { subPaths } = this
    if (subPaths.length) {
      // Mark last subpath closed.
      const prevPath = subPaths[subPaths.length - 1]
      const startX = prevPath.verts[0]
      const startY = prevPath.verts[1]
      prevPath.closed = true

      // Create new subpath using the starting position of previous subpath
      const newPath = new SubPath(startX, startY)
      subPaths.push(newPath)
    }
  }

  // Create a new subpath with the specified point as its first (and only) point
  moveTo = (x: number, y: number): void => {
    this.subPaths.push(new SubPath(x, y))
  }

  lineTo = (x: number, y: number): void => {
    if (this.subPaths.length) {
      this.subPaths[this.subPaths.length - 1].verts.push(x, y, 0, 0)
    } else {
      // Create a new subpath if none currently exist
      this.moveTo(x, y)
    }
  }

  quadraticCurveTo = (cpx: number, cpy: number, x: number, y: number): void => {
    console.warn('quadraticCurveTo not implemented')
  }

  bezierCurveTo = (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) => {
    console.warn('bezierCurveTo not implemented')
  }

  arcTo = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number
  ): void => {
    console.warn('arcTo not implemented')
  }

  // Adds a closed rect subpath and creates a new subpath
  rect(x: number, y: number, w: number, h: number): void {
    this.moveTo(x, y)
    this.lineTo(x + w, y)
    this.lineTo(x + w, y + h)
    this.lineTo(x, y + h)
    this.closePath()
  }

  arc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ): void => {
    console.warn('arc not implemented')
  }
}

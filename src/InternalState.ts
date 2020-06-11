type InternalStateSnapshot = {
  compositing: CanvasCompositing
  drawingStyles: Omit<CanvasPathDrawingStyles, 'getLineDash' | 'setLineDash'>
  imageSmoothing: CanvasImageSmoothing
  fillStrokeStyles: Omit<
    CanvasFillStrokeStyles,
    'createLinearGradient' | 'createPattern' | 'createRadialGradient'
  >
  filter: string
  shadowStyles: CanvasShadowStyles
  textDrawingStyles: CanvasTextDrawingStyles
}

export class InternalState {
  constructor(
    webgl: WebGLRenderingContext,
    options: {
      width?: number
      height?: number
    } = {}
  ) {
    this.webgl = webgl
    if (options.width) this.canvasWidth = options.width
    if (options.height) this.canvasHeight = options.height
  }

  webgl: WebGLRenderingContext
  canvasWidth = 800
  canvasHeight = 600
  stateStack: InternalStateSnapshot[] = []

  // state ----------

  compositing: CanvasCompositing = {
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
  }

  drawingStyles: Omit<
    CanvasPathDrawingStyles,
    'getLineDash' | 'setLineDash'
  > = {
    lineCap: 'butt',
    lineJoin: 'miter',
    lineDashOffset: 0,
    lineWidth: 1,
    miterLimit: 1,
  }

  imageSmoothing: CanvasImageSmoothing = {
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'medium',
  }

  fillStrokeStyles: Omit<
    CanvasFillStrokeStyles,
    'createLinearGradient' | 'createPattern' | 'createRadialGradient'
  > = {
    fillStyle: '#000000',
    strokeStyle: '#000000',
  }

  filter = 'none'

  shadowStyles: CanvasShadowStyles = {
    shadowBlur: 0,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  }

  textDrawingStyles: CanvasTextDrawingStyles = {
    direction: 'ltr',
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
  }

  save(): void {
    this.stateStack.push({
      compositing: {
        globalAlpha: this.compositing.globalAlpha,
        globalCompositeOperation: this.compositing.globalCompositeOperation,
      },
      drawingStyles: {
        lineCap: this.drawingStyles.lineCap,
        lineJoin: this.drawingStyles.lineJoin,
        lineDashOffset: this.drawingStyles.lineDashOffset,
        lineWidth: this.drawingStyles.lineWidth,
        miterLimit: this.drawingStyles.miterLimit,
      },
      fillStrokeStyles: {
        fillStyle: this.fillStrokeStyles.fillStyle,
        strokeStyle: this.fillStrokeStyles.strokeStyle,
      },
      imageSmoothing: {
        imageSmoothingEnabled: this.imageSmoothing.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothing.imageSmoothingQuality,
      },
      filter: this.filter,
      shadowStyles: {
        shadowBlur: this.shadowStyles.shadowBlur,
        shadowColor: this.shadowStyles.shadowColor,
        shadowOffsetX: this.shadowStyles.shadowOffsetX,
        shadowOffsetY: this.shadowStyles.shadowOffsetY,
      },
      textDrawingStyles: {
        direction: this.textDrawingStyles.direction,
        font: this.textDrawingStyles.font,
        textAlign: this.textDrawingStyles.textAlign,
        textBaseline: this.textDrawingStyles.textBaseline,
      },
    })
  }
  restore(): void {
    if (this.stateStack.length > 0) {
      const snapshot = this.stateStack.pop()
      this.compositing = snapshot.compositing
      this.drawingStyles = snapshot.drawingStyles
      this.imageSmoothing = snapshot.imageSmoothing
      this.fillStrokeStyles = snapshot.fillStrokeStyles
      this.filter = snapshot.filter
      this.shadowStyles = snapshot.shadowStyles
      this.textDrawingStyles = snapshot.textDrawingStyles
    }
  }
}

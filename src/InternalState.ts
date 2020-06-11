type DrawingState = {}

export class InternalState {
  constructor(webgl: WebGLRenderingContext) {
    this.webgl = webgl
    this.drawStateStack = []
  }
  webgl: WebGLRenderingContext
  drawStateStack: DrawingState[]

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
}

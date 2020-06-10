import { Compositing } from './Compositing'
import { DrawImage } from './DrawImage'
import { State } from './State'
import { InternalState } from './InternalState'

export class RenderingContext2D implements CanvasRenderingContext2D {
  constructor(webgl: WebGLRenderingContext) {
    this._internalState = new InternalState(webgl)
    this._state = new State(this._internalState)
    this._compositing = new Compositing(this._internalState)
    this._drawImage = new Compositing(this._internalState)
  }

  private _state: State
  private _internalState: InternalState
  private _compositing: Compositing
  private _drawImage: DrawImage

  get canvas(): HTMLCanvasElement {
    return null
  }

  get fillStyle(): string | CanvasGradient | CanvasPattern {
    return colorVecToString(this._internalState.fillStyle)
  }

  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    this._internalState.fillStyle =
      colorStringToVec4(value) || this._internalState.fillStyle
  }

  get strokeStyle() {
    return colorVecToString(this._internalState.strokeStyle)
  }

  set strokeStyle(value) {
    this._internalState.strokeStyle = colorStringToVec4(value)
  }

  get lineWidth() {
    return this._internalState.lineWidth
  }

  set lineWidth(value) {
    this.gl.$lineWidth(value)
    this._internalState.lineWidth = value
  }

  // Currently unsupported attributes and their default values
  get lineCap(): number {
    return this._internalState.lineCap
  }

  set lineCap(value) {
    this._internalState.lineCap = value
  }

  get lineJoin(): number {
    return this._internalState.lineJoin
  }
  set lineJoin(value) {
    this._internalState.lineJoin = value
  }

  get miterLimit(): number {
    return this._internalState.miterLimit
  }
  set miterLimit(value) {
    this._internalState.miterLimit = value
  }

  get shadowOffsetX(): number {
    return this._internalState.shadowOffsetX
  }
  set shadowOffsetX(value) {
    this._internalState.shadowOffsetX = value
  }

  get shadowOffsetY(): number {
    return this._internalState.shadowOffsetY
  }
  set shadowOffsetY(value) {
    this._internalState.shadowOffsetY = value
  }

  get shadowBlur(): number {
    return this._internalState.shadowBlur
  }
  set shadowBlur(value) {
    this._internalState.shadowBlur = value
  }
  get shadowColor(): string {
    return this._internalState.shadowColor
  }
  set shadowColor(value) {
    this._internalState.shadowColor = value
  }
  get font(): string {
    return this._internalState.font
  }
  set font(value) {
    this._internalState.font = value
  }

  get textAlign(): CanvasTextAlign {
    return this._internalState.textAlign
  }
  set textAlign(value) {
    this._internalState.textAlign = value
  }

  get textBaseline(): CanvasTextBaseline {
    return this._internalState.textBaseline
  }
  set textBaseline(value) {
    this._internalState.textBaseline = value
  }

  get globalAlpha(): number {
    return this._internalState.globalAlpha
  }
  set globalAlpha(value: number) {
    this._internalState.globalAlpha = value
  }

  get globalCompositeOperation(): string {
    return this._internalState.globalCompositeOperation
  }
  set globalCompositeOperation(value: string) {
    this._internalState.globalCompositeOperation = value
  }
}

import { InternalState } from './InternalState'

export class Compositing implements CanvasCompositing {
  constructor(internalState: InternalState) {
    this.internalState = internalState
    this.globalAlpha = 1
    this.globalCompositeOperation = 'normal'
  }

  internalState: InternalState
  globalAlpha: number
  globalCompositeOperation: string
}

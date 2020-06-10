import { InternalState } from './InternalState'

export class State implements CanvasState {
  constructor(internalState: InternalState) {
    this.internalState = internalState
  }
  internalState: InternalState

  restore(): void {
    return
  }

  save(): void {
    return
  }
}

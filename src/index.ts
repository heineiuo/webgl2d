import { CanvasRenderingContext2DImplemention } from './CanvasRenderingContext2D'

export function webgl2d(
  webgl: WebGLRenderingContext
): CanvasRenderingContext2DImplemention {
  return new CanvasRenderingContext2DImplemention(webgl)
}

import { RenderingContext2D } from "./RenderingContext2D";

export function webgl2d(
  webgl: WebGLRenderingContext
): CanvasRenderingContext2D {
  return new RenderingContext2D(webgl);
}

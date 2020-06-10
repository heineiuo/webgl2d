export class SubPath {
  constructor(x: number, y: number) {
    this.closed = false
    this.verts = [x, y, 0, 0]
  }

  closed: boolean
  verts: [number, number, number, number]
}

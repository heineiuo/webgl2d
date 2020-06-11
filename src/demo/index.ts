import { webgl2d } from '../'

class DemoLoader {
  constructor() {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    document.body.appendChild(canvas)
    const webgl = canvas.getContext('webgl')
    const ctx = webgl2d(webgl)
    console.log(ctx)

    ctx.fillStyle = 'blue'
    ctx.fillRect(10, 10, 100, 100)
  }
}

new DemoLoader()
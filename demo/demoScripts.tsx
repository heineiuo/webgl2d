export const demoScripts = {
  arc: (ctx: CanvasRenderingContext2D): void => {
    ctx.beginPath()
    ctx.arc(100, 75, 50, 0, 2 * Math.PI)
    ctx.stroke()
  },

  fillRect: (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = 'blue'
    ctx.fillRect(10, 10, 100, 100)
  },

  rect: (ctx: CanvasRenderingContext2D): void => {
    ctx.rect(10, 20, 150, 100)
    ctx.fill()
  },

  ellipse: (ctx: CanvasRenderingContext2D): void => {
    // Draw the ellipse
    ctx.beginPath()
    ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw the ellipse's line of reflection
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    ctx.moveTo(0, 200)
    ctx.lineTo(200, 0)
    ctx.stroke()
  },

  rotate: (ctx: CanvasRenderingContext2D): void => {
    // Point of transform origin
    ctx.arc(0, 0, 5, 0, 2 * Math.PI)
    ctx.fillStyle = 'blue'
    ctx.fill()

    // Non-rotated rectangle
    ctx.fillStyle = 'gray'
    ctx.fillRect(100, 0, 80, 20)

    // Rotated rectangle
    ctx.rotate((45 * Math.PI) / 180)
    ctx.fillStyle = 'red'
    ctx.fillRect(100, 0, 80, 20)

    // Reset transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  },

  scale: (ctx: CanvasRenderingContext2D): void => {
    // Scaled rectangle
    ctx.scale(9, 3)
    ctx.fillStyle = 'red'
    ctx.fillRect(10, 10, 8, 20)

    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Non-scaled rectangle
    ctx.fillStyle = 'gray'
    ctx.fillRect(10, 10, 8, 20)
  },

  translate: (ctx: CanvasRenderingContext2D): void => {
    // Moved square
    ctx.translate(110, 30)
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 80, 80)

    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Unmoved square
    ctx.fillStyle = 'gray'
    ctx.fillRect(0, 0, 80, 80)
  },

  drawImage: (ctx: CanvasRenderingContext2D): void => {
    const image = new Image()
    image.onload = (): void => {
      ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104)
    }
    image.src = '/rhino.jpg'
  },

  fillText: (ctx: CanvasRenderingContext2D): void => {
    ctx.font = '48px serif'
    ctx.fillText('Hello world', 10, 50)
  },
}

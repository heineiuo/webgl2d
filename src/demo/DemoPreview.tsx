import React from 'react'
import { webgl2d } from '../'

export function DemoPreview(props: {
  onContextCreated: (ctx: CanvasRenderingContext2D) => void
}): JSX.Element {
  const canvasRef = React.useRef(null)
  const canvasNormalRef = React.useRef(null)

  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = 800
      canvas.height = 600
      const webgl = canvas.getContext('webgl')
      const ctx = webgl2d(webgl)
      props.onContextCreated(ctx)
      console.log()
    }
  }, [canvasRef])

  React.useEffect(() => {
    if (canvasNormalRef.current) {
      const canvas = canvasNormalRef.current
      canvas.width = 800
      canvas.height = 600
      const ctx = canvas.getContext('2d')
      props.onContextCreated(ctx)
      console.log()
    }
  }, [canvasNormalRef])

  const preStyle = React.useMemo<React.CSSProperties>(
    () => ({
      borderWidth: 0,
      borderTopWidth: 1,
      borderColor: '#eee',
      borderStyle: 'solid',
      padding: 20,
      boxSizing: 'border-box',
    }),
    []
  )

  return (
    <div>
      <div style={{ padding: 20 }}>
        <div style={{ padding: 20 }}>webgl2d</div>
        <canvas ref={canvasRef}> </canvas>
      </div>
      <div style={{ margin: '20px 0', borderBottom: '1px solid #eee' }}></div>
      <div style={{ padding: 20 }}>
        <div style={{ padding: 20 }}>normal 2d</div>
        <canvas ref={canvasNormalRef}> </canvas>
      </div>
      <div>
        <pre style={preStyle}>{props.onContextCreated.toString()}</pre>
      </div>
    </div>
  )
}

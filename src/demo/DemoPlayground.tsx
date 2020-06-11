import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { DemoPreview } from './DemoPreview'
import { demoScripts } from './demoScripts'

export function DemoPlayground(): JSX.Element {
  const params = useParams<{
    apiName: string
  }>()

  const sidebarStyle = React.useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: 300,
      borderWidth: 0,
      borderRightWidth: 1,
      borderStyle: 'solid',
      borderColor: '#eee',
    }),
    []
  )
  const sidebarHeadStyle = React.useMemo<React.CSSProperties>(
    () => ({
      padding: 20,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: '#eee',
    }),
    []
  )

  const allMethods = Object.keys(demoScripts).sort()

  return (
    <div>
      <div>
        {/* sidebar */}
        <div style={sidebarStyle}>
          <div style={sidebarHeadStyle}>
            <div style={{ fontSize: 20 }}>webgl2d</div>
            <div style={{ fontSize: 14 }}>
              Create CanvasRenderingContext2D from WebGLRenderingContext
            </div>
          </div>

          <div style={{ padding: 20 }}>
            {allMethods.map((apiName: string) => {
              return (
                <div key={apiName}>
                  <Link
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 16,
                      textDecoration: 'none',
                    }}
                    to={`/demo/${apiName}`}
                  >
                    {apiName}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: 300 }}>
        <DemoPreview
          key={params.apiName}
          onContextCreated={demoScripts[params.apiName]}
        ></DemoPreview>
      </div>
    </div>
  )
}

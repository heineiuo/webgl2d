import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

class DemoLoader {
  constructor() {
    let root = document.getElementById('root')
    if (!root) {
      root = document.createElement('div')
      root.id = 'root'
      document.body.appendChild(root)
    }
    document.body.style.margin = '0px'
    ReactDOM.render(<App></App>, root)
  }
}

new DemoLoader()

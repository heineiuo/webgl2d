export const colors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
}

export type Vector4 = [number, number, number, number]

const reRGBAColor = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/
const reHSLAColor = /^hsl(a)?\(\s*(-?[\d\.]+)\s*,\s*(-?[\d\.]+)%\s*,\s*(-?[\d\.]+)%\s*,?\s*(-?[\d\.]+)?\s*\)$/
const reHex6Color = /^#([0-9A-Fa-f]{6})$/
const reHex3Color = /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/

function HSLAToRGBA(
  h: number,
  s: number,
  l: number,
  a: number
): [number, number, number, number] {
  // Clamp and Normalize values
  h = (((h % 360) + 360) % 360) / 360
  s = s > 100 ? 1 : s / 100
  s = s < 0 ? 0 : s
  l = l > 100 ? 1 : l / 100
  l = l < 0 ? 0 : l

  const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s
  const m1 = l * 2 - m2

  function getHue(value: number): number {
    let hue: number

    if (value * 6 < 1) {
      hue = m1 + (m2 - m1) * value * 6
    } else if (value * 2 < 1) {
      hue = m2
    } else if (value * 3 < 2) {
      hue = m1 + (m2 - m1) * (2 / 3 - value) * 6
    } else {
      hue = m1
    }

    return hue
  }

  const r = getHue(h + 1 / 3)
  const g = getHue(h)
  const b = getHue(h - 1 / 3)

  return [r, g, b, a]
}

export function colorStringToVec4(value: string): Vector4 | false {
  let match = reRGBAColor.exec(value)
  let result: Vector4 = [0, 0, 0, 0]

  if (match) {
    const hasAlpha = match[1]
    const alphaChannel = parseFloat(match[8])

    if (
      (hasAlpha && isNaN(alphaChannel)) ||
      (!hasAlpha && !isNaN(alphaChannel))
    ) {
      return false
    }

    const sameType = match[3]

    for (let i = 2; i < 8; i += 2) {
      let channel = parseFloat(match[i])
      const isPercent = match[i + 1]

      if (isPercent !== sameType) {
        return false
      }

      // Clamp and normalize values
      if (isPercent) {
        channel = channel > 100 ? 1 : channel / 100
        channel = channel < 0 ? 0 : channel
      } else {
        channel = channel > 255 ? 1 : channel / 255
        channel = channel < 0 ? 0 : channel
      }

      result.push(channel)
    }

    result.push(hasAlpha ? alphaChannel : 1.0)

    return result
  }

  match = reHSLAColor.exec(value)

  if (match) {
    const hasAlpha = !!match[1]
    const alphaChannel = parseFloat(match[5])
    result = HSLAToRGBA(
      parseInt(match[2]),
      parseInt(match[3]),
      parseInt(match[4]),
      parseFloat(String(hasAlpha && alphaChannel ? alphaChannel : 1.0))
    )
    return result
  }

  match = reHex6Color.exec(value)

  if (match) {
    const colorInt = parseInt(match[1], 16)
    result = [
      ((colorInt & 0xff0000) >> 16) / 255,
      ((colorInt & 0x00ff00) >> 8) / 255,
      (colorInt & 0x0000ff) / 255,
      1.0,
    ]

    return result
  }
  match = reHex3Color.exec(value)

  if (match) {
    const hexString =
      '#' +
      [match[1], match[1], match[2], match[2], match[3], match[3]].join('')
    return colorStringToVec4(hexString)
  }
  if (value.toLowerCase() in colors) {
    return colorStringToVec4(colors[value.toLowerCase()])
  }

  if (value.toLowerCase() === 'transparent') {
    return [0, 0, 0, 0]
  }

  // Color keywords not yet implemented, ie "orange", return hot pink
  return false
}

export function isPOT(value: number): boolean {
  return value > 0 && ((value - 1) & value) === 0
}

export function colorVecToString(vec4: Vector4): string {
  return (
    'rgba(' +
    vec4[0] * 255 +
    ', ' +
    vec4[1] * 255 +
    ', ' +
    vec4[2] * 255 +
    ', ' +
    parseFloat(String(vec4[3])) +
    ')'
  )
}

export const shaderMask = {
  texture: 1,
  crop: 2,
  path: 4,
}

export function getFragmentShaderSource(sMask: number): string {
  const fsSource = [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',

    '#define hasTexture ' + (sMask & shaderMask.texture ? '1' : '0'),
    '#define hasCrop ' + (sMask & shaderMask.crop ? '1' : '0'),

    'varying vec4 vColor;',

    '#if hasTexture',
    'varying vec2 vTextureCoord;',
    'uniform sampler2D uSampler;',
    '#if hasCrop',
    'uniform vec4 uCropSource;',
    '#endif',
    '#endif',

    'void main(void) {',
    '#if hasTexture',
    '#if hasCrop',
    'gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x * uCropSource.z, vTextureCoord.y * uCropSource.w) + uCropSource.xy);',
    '#else',
    'gl_FragColor = texture2D(uSampler, vTextureCoord);',
    '#endif',
    '#else',
    'gl_FragColor = vColor;',
    '#endif',
    '}',
  ].join('\n')

  return fsSource
}

export function getVertexShaderSource(
  stackDepth: number,
  sMask: number,
  canvasWidth: number,
  canvasHeight: number
): string {
  const w = 2 / canvasWidth
  const h = -2 / canvasHeight

  stackDepth = stackDepth || 1

  const vsSource = [
    '#define hasTexture ' + (sMask & shaderMask.texture ? '1' : '0'),
    'attribute vec4 aVertexPosition;',

    '#if hasTexture',
    'varying vec2 vTextureCoord;',
    '#endif',

    'uniform vec4 uColor;',
    'uniform mat3 uTransforms[' + stackDepth + '];',

    'varying vec4 vColor;',

    'const mat4 pMatrix = mat4(' +
      w +
      ',0,0,0, 0,' +
      h +
      ',0,0, 0,0,1.0,1.0, -1.0,1.0,0,0);',

    'mat3 crunchStack(void) {',
    'mat3 result = uTransforms[0];',
    'for (int i = 1; i < ' + stackDepth + '; ++i) {',
    'result = uTransforms[i] * result;',
    '}',
    'return result;',
    '}',

    'void main(void) {',
    'vec3 position = crunchStack() * vec3(aVertexPosition.x, aVertexPosition.y, 1.0);',
    'gl_Position = pMatrix * vec4(position, 1.0);',
    'vColor = uColor;',
    '#if hasTexture',
    'vTextureCoord = aVertexPosition.zw;',
    '#endif',
    '}',
  ].join('\n')
  return vsSource
}

export class SubPath {
  constructor(x: number, y: number) {
    this.closed = false
    this.verts = [x, y, 0, 0]
  }

  closed: boolean
  verts: [number, number, number, number]
}

// -------------------------------------------------

/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 */
export function createProgram(
  gl: WebGLRenderingContext,
  shaders: WebGLShader[],
  optAttribs?: string[],
  optLocations?: number[]
): WebGLProgram {
  const program = gl.createProgram()
  shaders.forEach((shader: WebGLShader) => {
    gl.attachShader(program, shader)
  })
  if (optAttribs) {
    optAttribs.forEach((attrib: string, ndx: number) => {
      gl.bindAttribLocation(
        program,
        optLocations ? optLocations[ndx] : ndx,
        attrib
      )
    })
  }
  gl.linkProgram(program)

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program)
    console.error('Error in program linking:' + lastError)

    gl.deleteProgram(program)
    return null
  }
  return program
}

export function loadShader(
  gl: WebGLRenderingContext,
  shaderSource: string,
  shaderType: number // gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
): WebGLShader {
  // Create the shader object
  const shader = gl.createShader(shaderType)

  // Load the shader source
  gl.shaderSource(shader, shaderSource)

  // Compile the shader
  gl.compileShader(shader)

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader)
    console.error("*** Error compiling shader '" + shader + "':" + lastError)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

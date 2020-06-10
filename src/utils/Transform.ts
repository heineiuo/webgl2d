const mat3 = {
  identity: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],

  multiply(m1: number[], m2: number[]): void {
    const m10 = m1[0]
    const m11 = m1[1]
    const m12 = m1[2]
    const m13 = m1[3]
    const m14 = m1[4]
    const m15 = m1[5]
    const m16 = m1[6]
    const m17 = m1[7]
    const m18 = m1[8]
    const m20 = m2[0]
    const m21 = m2[1]
    const m22 = m2[2]
    const m23 = m2[3]
    const m24 = m2[4]
    const m25 = m2[5]
    const m26 = m2[6]
    const m27 = m2[7]
    const m28 = m2[8]

    m2[0] = m20 * m10 + m23 * m11 + m26 * m12
    m2[1] = m21 * m10 + m24 * m11 + m27 * m12
    m2[2] = m22 * m10 + m25 * m11 + m28 * m12
    m2[3] = m20 * m13 + m23 * m14 + m26 * m15
    m2[4] = m21 * m13 + m24 * m14 + m27 * m15
    m2[5] = m22 * m13 + m25 * m14 + m28 * m15
    m2[6] = m20 * m16 + m23 * m17 + m26 * m18
    m2[7] = m21 * m16 + m24 * m17 + m27 * m18
    m2[8] = m22 * m16 + m25 * m17 + m28 * m18
  },

  vec2_multiply(m1: number[], m2: number[]): number[] {
    const mOut = []
    mOut[0] = m2[0] * m1[0] + m2[3] * m1[1] + m2[6]
    mOut[1] = m2[1] * m1[0] + m2[4] * m1[1] + m2[7]
    return mOut
  },

  transpose(m: number[]): number[] {
    return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]
  },
}

const STACK_DEPTH_LIMIT = 16

export class Transform {
  static getIdentity(): number[] {
    return [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
  }

  constructor(mat) {
    this.clearStack(mat)
  }

  m_stack: number[][]
  m_cache: number[]
  c_stack: number
  valid: number
  result: void

  clearStack(init_mat: any): void {
    this.m_stack = []
    this.m_cache = []
    this.c_stack = 0
    this.valid = 0
    this.result = null

    for (let i = 0; i < STACK_DEPTH_LIMIT; i++) {
      this.m_stack[i] = Transform.getIdentity()
    }

    if (init_mat !== undefined) {
      this.m_stack[0] = init_mat
    } else {
      this.setIdentity()
    }
  } //clearStack

  setIdentity() {
    this.m_stack[this.c_stack] = Transform.getIdentity()
    if (this.valid === this.c_stack && this.c_stack) {
      this.valid--
    }
  }

  getResult() {
    if (!this.c_stack) {
      return this.m_stack[0]
    }

    var m = mat3.identity.slice()

    if (this.valid > this.c_stack - 1) {
      this.valid = this.c_stack - 1
    }

    for (var i = this.valid; i < this.c_stack + 1; i++) {
      m = mat3.multiply(this.m_stack[i], m)
      this.m_cache[i] = m
    }

    this.valid = this.c_stack - 1

    this.result = this.m_cache[this.c_stack]

    return this.result
  }

  pushMatrix() {
    this.c_stack++
    this.m_stack[this.c_stack] = Transform.getIdentity()
  }

  popMatrix() {
    if (this.c_stack === 0) {
      return
    }
    this.c_stack--
  }

  translateMatrix = Transform.getIdentity()

  translate(x, y) {
    this.translateMatrix[6] = x
    this.translateMatrix[7] = y

    mat3.multiply(this.translateMatrix, this.m_stack[this.c_stack])

    /*
      if (this.valid === this.c_stack && this.c_stack) {
        this.valid--;
      }
      */
  }

  scaleMatrix = Transform.getIdentity()
  rotateMatrix = Transform.getIdentity()

  scale(x, y) {
    this.scaleMatrix[0] = x
    this.scaleMatrix[4] = y

    mat3.multiply(this.scaleMatrix, this.m_stack[this.c_stack])

    /*
      if (this.valid === this.c_stack && this.c_stack) {
        this.valid--;
      }
      */
  }

  rotate(ang: number): void {
    const sAng = Math.sin(-ang)
    const cAng = Math.cos(-ang)

    this.rotateMatrix[0] = cAng
    this.rotateMatrix[3] = sAng
    this.rotateMatrix[1] = -sAng
    this.rotateMatrix[4] = cAng

    mat3.multiply(this.rotateMatrix, this.m_stack[this.c_stack])

    /*
      if (this.valid === this.c_stack && this.c_stack) {
        this.valid--;
      }
      */
  }
}

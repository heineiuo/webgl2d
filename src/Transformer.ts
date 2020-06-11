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

  vec2Multiply(m1: number[], m2: number[]): number[] {
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

export class Transformer {
  static getIdentity(): number[] {
    return [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
  }

  constructor(mat?: number[]) {
    this.clearStack(mat)
  }

  matStack: number[][]
  matCache: number[][]
  cStack: number
  valid: number
  result: number[]

  clearStack(initMat?: number[]): void {
    this.matStack = []
    this.matCache = []
    this.cStack = 0
    this.valid = 0
    this.result = null

    for (let i = 0; i < STACK_DEPTH_LIMIT; i++) {
      this.matStack[i] = Transformer.getIdentity()
    }

    if (!!initMat) {
      this.matStack[0] = initMat
    } else {
      this.setIdentity()
    }
  } //clearStack

  setIdentity(): void {
    this.matStack[this.cStack] = Transformer.getIdentity()
    if (this.valid === this.cStack && this.cStack) {
      this.valid--
    }
  }

  getResult(): number[] {
    if (!this.cStack) {
      return this.matStack[0]
    }

    const m = mat3.identity.slice()

    if (this.valid > this.cStack - 1) {
      this.valid = this.cStack - 1
    }

    for (let i = this.valid; i < this.cStack + 1; i++) {
      mat3.multiply(this.matStack[i], m)
      this.matCache[i] = m
    }

    this.valid = this.cStack - 1

    this.result = this.matCache[this.cStack]

    return this.result
  }

  pushMatrix(): void {
    this.cStack++
    this.matStack[this.cStack] = Transformer.getIdentity()
  }

  popMatrix(): void {
    if (this.cStack === 0) {
      return
    }
    this.cStack--
  }

  translateMatrix = Transformer.getIdentity()

  translate(x: number, y: number): void {
    this.translateMatrix[6] = x
    this.translateMatrix[7] = y

    mat3.multiply(this.translateMatrix, this.matStack[this.cStack])

    /*
      if (this.valid === this.cStack && this.cStack) {
        this.valid--;
      }
      */
  }

  scaleMatrix = Transformer.getIdentity()
  rotateMatrix = Transformer.getIdentity()

  scale(x: number, y: number): void {
    this.scaleMatrix[0] = x
    this.scaleMatrix[4] = y

    mat3.multiply(this.scaleMatrix, this.matStack[this.cStack])

    /*
      if (this.valid === this.cStack && this.cStack) {
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

    mat3.multiply(this.rotateMatrix, this.matStack[this.cStack])

    /*
      if (this.valid === this.cStack && this.cStack) {
        this.valid--;
      }
      */
  }
}

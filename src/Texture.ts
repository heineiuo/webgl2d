function Texture(image) {
  this.obj = gl.createTexture()
  this.index = textureCache.push(this)

  imageCache.push(image)

  // we may wish to consider tiling large images like this instead of scaling and
  // adjust appropriately (flip to next texture source and tile offset) when drawing
  if (image.width > gl2d.maxTextureSize || image.height > gl2d.maxTextureSize) {
    var canvas = document.createElement('canvas')

    canvas.width =
      image.width > gl2d.maxTextureSize ? gl2d.maxTextureSize : image.width
    canvas.height =
      image.height > gl2d.maxTextureSize ? gl2d.maxTextureSize : image.height

    var ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      canvas.width,
      canvas.height
    )

    image = canvas
  }

  gl.bindTexture(gl.TEXTURE_2D, this.obj)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  // Enable Mip mapping on power-of-2 textures
  if (isPOT(image.width) && isPOT(image.height)) {
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    )
    gl.generateMipmap(gl.TEXTURE_2D)
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }

  // Unbind texture
  gl.bindTexture(gl.TEXTURE_2D, null)
}

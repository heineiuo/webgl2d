import fs from 'fs'
import path from 'path'

async function main(): Promise<void> {
  const pkg = JSON.parse(
    await fs.promises.readFile(
      path.resolve(process.cwd(), './package.json'),
      'utf-8'
    )
  )

  await fs.promises.mkdir(
    path.resolve(process.cwd(), `./build/${pkg.name}@${pkg.version}/build`),
    { recursive: true }
  )
  await fs.promises.rename(
    path.resolve(process.cwd(), `./build/index.js`),
    path.resolve(
      process.cwd(),
      `./build/${pkg.name}@${pkg.version}/build/index.js`
    )
  )
}

main()

import { cpus } from 'os'
// 没错，它没有提供声明
// 这里是他的接口 https://github.com/GoogleChromeLabs/squoosh/blob/ad5002c79cccab7291b7bbb5d9f6270087ca6d4e/libsquoosh/src/codecs.ts#L251-L427
import { ImagePool } from '@squoosh/lib'

const imagePool = new ImagePool(cpus().length)

export async function compress(
  file: Buffer,
) {
  const image = imagePool.ingestImage(file)

  const encodeOptions = {
    mozjpeg: {},
  }
  await image.encode(encodeOptions)
  const result = await image?.encodedWith?.mozjpeg
  return [
    result?.binary,
    result?.extension,
  ]
}

import { fileTypeFromBuffer } from 'file-type'

// import { compress as pngquantCompress } from './pngquant'
import { compress as squooshCompress } from './squoosh'
import { compress as tinypngCompress } from './tiny-png'

export async function autoCompress(file: Buffer) {
  const typeInfo = await fileTypeFromBuffer(file)
  if (typeInfo) {
    const type = typeInfo.ext
    console.log('type', type)
    if (type === 'jpg') {
      console.log('🔍 use squoosh')
      return squooshCompress(file)
    }
    if (type === 'png') {
      console.log('🐼 use tiny-png')
      return tinypngCompress(file)
    }
  }
  return Promise.reject(new Error('can not get image type'))
}

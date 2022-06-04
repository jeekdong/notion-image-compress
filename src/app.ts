import { Readable } from 'stream'

import {
  findImageBlocks,
  getImageUrls,
  getPageBlocks,
  updateImgUrl,
} from './notion'
import { downloadImg } from './download'
import { autoCompress } from './compress'
import { uploadImage } from './upload-img'
import { CDN_PREFIX } from './utils/constants'

export async function app(notionPageId: string) {
  try {
    const pageId = notionPageId || ''
    const pageBlocks = await getPageBlocks(pageId)
    const imageBlockIds = await findImageBlocks(pageBlocks)
    const imageUrls = await getImageUrls(pageBlocks, imageBlockIds)
    console.log('imageUrls', imageUrls)
    for (let i = 0; i < imageUrls.length; i++) {
      const buffer = await downloadImg(imageUrls[i].url)
      const [compressBuffer, extension] = await autoCompress(buffer)
      const stream = new Readable({
        read() {
          this.push(compressBuffer)
          this.push(null)
        },
      })
      const key = `${CDN_PREFIX}/${imageUrls[i].id}-${Date.now()}.${extension}`
      const compressUrl = await uploadImage({
        stream, key,
      })
      if (compressUrl)
        await updateImgUrl(imageUrls[i].id, compressUrl)
    }
    console.log('✅ done!!')
    process.exit(0)
  }
  catch (err) {
    console.log('❌ 发生错误:', err)
    process.exit(1)
  }
}

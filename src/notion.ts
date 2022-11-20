import { NotionAPI } from 'notion-client'
import { Client } from '@notionhq/client'

import type { ExtendedRecordMap } from 'notion-types'

import { conf, extractArray } from './utils/tools'

import {
  CONF_KEY_NOTION_ACCESS_TOKEN,
} from './utils/constants'
const notion = new Client({ auth: conf.getConfig()[CONF_KEY_NOTION_ACCESS_TOKEN] })

export async function getPageBlocks(
  id: string,
) {
  const api = new NotionAPI()
  const pageBlock = await api.getPage(id)
  return pageBlock
}

export async function findImageBlocks(
  recordMap: ExtendedRecordMap,
) {
  const allBlocksKey = Object.keys(recordMap.block)
  const imageBlockIds: string[] = []
  for (let i = 0; i < allBlocksKey.length; i++) {
    const block = recordMap.block[allBlocksKey[i]]
    if (block.value.type === 'image')
      imageBlockIds.push(block.value.id)
  }
  return imageBlockIds
}

export async function getImageUrls(
  recordMap: ExtendedRecordMap,
  imageBlockIds: string[],
) {
  const imageUrls: {
    id: string
    url: string
  }[] = []
  for (let i = 0; i < imageBlockIds.length; i++) {
    const block = recordMap.block[imageBlockIds[i]]
    const imageUrl = extractArray(recordMap.signed_urls[imageBlockIds[i]])
      || extractArray(block.value.properties.source)
    imageUrls.push({
      id: imageBlockIds[i],
      url: imageUrl,
    })
  }
  return imageUrls
}

export async function updateImgUrl(
  id: string, url: string,
) {
  const blockId = id
  const response = await notion.blocks.update({
    block_id: blockId,
    type: 'image',
    image: {
      // caption: [{
      //   type: 'text',
      //   text: {
      //     content: '我是替换的内容',
      //   },
      // }],
      external: {
        url,
      },
    },
  })
  console.log(response)
}

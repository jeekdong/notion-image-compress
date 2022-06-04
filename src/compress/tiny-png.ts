import fetch from 'node-fetch'
import { downloadImg } from '../download'

// 生成随机IP， 赋值给 X-Forwarded-For
export function getRandomIP() {
  return Array.from(Array(4)).map(() => (Math.random() * 255).toFixed(0)).join('.')
}

export function compress(
  file: Buffer,
) {
  return fetch('https://tinypng.com//web/shrink', {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Forwarded-For': getRandomIP(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    },
    body: file,
  }).then(async res => await res.json())
    .then(async (res: any) => {
      return res.output.url
    })
    .then(async (res) => {
      return [
        await downloadImg(res),
        'png',
      ]
    })
}

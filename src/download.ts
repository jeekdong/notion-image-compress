import https from 'https'
import { Buffer } from 'buffer'

export async function downloadImg(
  url: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, {}, (res) => {
      const data: any[] = []
      res.on('data', (chunk) => {
        data.push(chunk)
      }).on('end', () => {
        console.log('donwload!!')
        const buffer = Buffer.concat(data)
        resolve(buffer)
      })
      res.on('error', (err) => {
        reject(err)
      })
    })
  })
}

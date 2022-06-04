import qiniu from 'qiniu'

import {
  BUCKET,
  CDN_URL,
  CONF_KEY_UPLOAD_KEY,
  CONF_KEY_UPLOAD_TOKEN,
} from './utils/constants'
import { conf } from './utils/tools'

const QINIU_ACCESS_KEY = conf.getConfig()[CONF_KEY_UPLOAD_KEY] || ''
const QINIU_SECRET_KEY = conf.getConfig()[CONF_KEY_UPLOAD_TOKEN] || ''

qiniu.conf.ACCESS_KEY = QINIU_ACCESS_KEY
qiniu.conf.SECRET_KEY = QINIU_SECRET_KEY

export function uploadConfig() {
  const config = new qiniu.conf.Config()
  const mac = new qiniu.auth.digest.Mac(
    QINIU_ACCESS_KEY,
    QINIU_SECRET_KEY,
  )
  // @ts-expect-error
  config.zone = qiniu.zone.Zone_z2

  const options = {
    scope: BUCKET,
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  return {
    config,
    uploadToken,
    mac,
  }
}
// 生成配置
const {
  config,
  uploadToken,
} = uploadConfig()

export const uploadImage = async ({
  stream,
  key,
}: {
  stream: NodeJS.ReadableStream
  key: string
}): Promise<undefined | string> => {
  return new Promise((resolve) => {
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()

    formUploader.putStream(
      uploadToken,
      key,
      stream,
      putExtra,
      (respErr,
        respBody,
        respInfo,
      ) => {
        if (respErr) {
          console.log('upload img error', respErr)
          resolve(undefined)
        }
        if (respInfo.statusCode === 200) {
          console.log('upload success', key)
          resolve(`${CDN_URL}/${key}`)
        }
        else {
          console.log('upload img error', respBody)
          resolve(undefined)
        }
      })
  })
}


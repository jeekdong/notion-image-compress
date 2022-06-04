import fs from 'fs'
import path from 'path'
import nconf from 'nconf'
import {
  CONF_KEY_NOTION_ACCESS_TOKEN,
  CONF_KEY_UPLOAD_KEY,
  CONF_KEY_UPLOAD_TOKEN,
  CONF_PATH,
} from './constants'

export class Conf {
  constructor() {
    nconf.argv().env().file({ file: CONF_PATH })
    this._init()
  }

  _init() {
    const dirPath = path.dirname(CONF_PATH)
    fs.mkdir(dirPath, {
      recursive: true,
    }, (err) => {
      if (err)
        console.error('初始化配置失败')
    })
  }

  getConfig() {
    return {
      [CONF_KEY_NOTION_ACCESS_TOKEN]: nconf.get(CONF_KEY_NOTION_ACCESS_TOKEN),
      [CONF_KEY_UPLOAD_KEY]: nconf.get(CONF_KEY_UPLOAD_KEY),
      [CONF_KEY_UPLOAD_TOKEN]: nconf.get(CONF_KEY_UPLOAD_TOKEN),
    }
  }

  setNotionToken(value: string) {
    nconf.set(CONF_KEY_NOTION_ACCESS_TOKEN, value)
    nconf.save({
      [CONF_KEY_NOTION_ACCESS_TOKEN]: value,
    })
  }

  setUploadKey(value: string) {
    nconf.set(CONF_KEY_UPLOAD_KEY, value)
    nconf.save({
      [CONF_KEY_UPLOAD_KEY]: value,
    })
  }

  setUploadToken(value: string) {
    nconf.set(CONF_KEY_UPLOAD_TOKEN, value)
    nconf.save({
      [CONF_KEY_UPLOAD_TOKEN]: value,
    })
  }

  reset() {
    nconf.reset()
    nconf.save({})
  }
}

export const conf = new Conf()

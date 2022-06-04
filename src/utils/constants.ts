import path from 'path'
import os from 'os'

export const CDN_PREFIX = 'notion-compress'
export const BUCKET = 'jeekdong-blog-files'
export const CDN_URL = 'https://blog-files.jeekdong.top'

export const CONF_PATH = path.resolve(os.homedir(), '.notion-image-compress', 'config.json')
export const CONF_KEY_NOTION_ACCESS_TOKEN = 'NOTION_ACCESS_TOKEN'
export const CONF_KEY_UPLOAD_KEY = 'QINIU_ACCESS_KEY'
export const CONF_KEY_UPLOAD_TOKEN = 'QINIU_SECRET_KEY'

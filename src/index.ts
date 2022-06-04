import { program } from 'commander'
import inquirer from 'inquirer'
import { conf } from './utils/tools'
import { app } from './app'

import {
  CONF_KEY_NOTION_ACCESS_TOKEN,
  CONF_KEY_UPLOAD_KEY,
  CONF_KEY_UPLOAD_TOKEN,
} from './utils/constants'

program.version(process.env.npm_package_version ?? '0.0.1')
program.option(
  `--${CONF_KEY_NOTION_ACCESS_TOKEN} <NOTION-ACCESS_TOKEN>`, '设置 Notion 的 access token',
).option(
  `--${CONF_KEY_UPLOAD_KEY} <QINIU-ACCESS-KEY>`, '设置七牛云的 access key',
).option(
  `--${CONF_KEY_UPLOAD_TOKEN} <QINIU-SECRET-KEY>`, '设置七牛云的 secret key',
).option(
  '-r, --reset', '重置配置',
).option(
  '-p, --notionPageId <NOTION-PAGE-ID>', '设置 Notion 的 page id',
)
program.parse()

const notion_prompt = {
  type: 'input',
  message: '请输入Notion 的 access token',
  name: CONF_KEY_NOTION_ACCESS_TOKEN,
}
const qiniu_key_prompt = {
  type: 'input',
  message: '请输入七牛云的 access key',
  name: CONF_KEY_UPLOAD_KEY,
}
const qiniu_token_prompt = {
  type: 'input',
  message: '请输入七牛云的 secret key',
  name: CONF_KEY_UPLOAD_TOKEN,
}
const notion_page_id_prompt = {
  type: 'input',
  message: '请输入Notion 的 page id',
  name: 'notionPageId',
}

async function init() {
  const options = program.opts()
  if (options.reset) {
    conf.reset()
    console.log('✅ 配置已重置')
    process.exit(0)
  }
  let notionPageId = options.notionPageId
  // conf 会自动读取命令行的参数
  // 不需要手动从 program options 中读取
  const promptList = []
  if (!conf.getConfig()[CONF_KEY_NOTION_ACCESS_TOKEN])
    promptList.push(notion_prompt)
  if (!conf.getConfig()[CONF_KEY_UPLOAD_KEY])
    promptList.push(qiniu_key_prompt)
  if (!conf.getConfig()[CONF_KEY_UPLOAD_TOKEN])
    promptList.push(qiniu_token_prompt)
  if (!options.notionPageId)
    promptList.push(notion_page_id_prompt)

  if (promptList.length) {
    const answers = await inquirer.prompt(promptList)
    Object.keys(answers).forEach((key) => {
      if (answers[key] && key === CONF_KEY_NOTION_ACCESS_TOKEN)
        conf.setNotionToken(answers[key])
      if (answers[key] && key === CONF_KEY_UPLOAD_KEY)
        conf.setUploadKey(answers[key])
      if (answers[key] && key === CONF_KEY_UPLOAD_TOKEN)
        conf.setUploadToken(answers[key])
      if (answers[key] && key === 'notionPageId')
        notionPageId = answers[key]
    })
  }
  // 执行主程序
  app(
    notionPageId,
  )
}

init()

import { Command } from 'commander'
import inquirer from 'inquirer'
import { version } from '../package.json'
import { conf } from './utils/tools'
import { app } from './app'

import {
  CONF_KEY_NOTION_ACCESS_TOKEN,
  CONF_KEY_UPLOAD_KEY,
  CONF_KEY_UPLOAD_TOKEN,
} from './utils/constants'

const program = new Command()

program
  .version(version || '0.0.1')
  .description('将 notion page 页面的图片统一压缩并替换')
  .option(
  `--${CONF_KEY_NOTION_ACCESS_TOKEN} <NOTION-ACCESS_TOKEN>`, '设置 Notion 的 access token',
  )
  .option(
  `--${CONF_KEY_UPLOAD_KEY} <QINIU-ACCESS-KEY>`, '设置七牛云的 access key',
  ).option(
  `--${CONF_KEY_UPLOAD_TOKEN} <QINIU-SECRET-KEY>`, '设置七牛云的 secret key',
  )
  .option(
    '-r, --reset', '重置配置',
  ).option(
    '-p, --notionPageId <NOTION-PAGE-ID>', '设置 Notion 的 page id',
  )

program.parse()
const options = program.opts()

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

function updateConfig(data: any) {
  Object.keys(data).forEach((key) => {
    if (data[key] && key === CONF_KEY_NOTION_ACCESS_TOKEN)
      conf.setNotionToken(data[key])
    if (data[key] && key === CONF_KEY_UPLOAD_KEY)
      conf.setUploadKey(data[key])
    if (data[key] && key === CONF_KEY_UPLOAD_TOKEN)
      conf.setUploadToken(data[key])
  })
}

async function init() {
  if (options.reset) {
    conf.reset()
    console.log('✅ 配置已重置')
    process.exit(0)
  }
  let notionPageId = options.notionPageId

  // 通过 args 更新 config
  updateConfig(options)

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
    // 通过手动输入来更新 conf
    updateConfig(answers)
    if (answers.notionPageId)
      notionPageId = answers.notionPageId
  }
  // 执行主程序
  app(
    notionPageId,
  )
}

init()

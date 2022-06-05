# Notion Image Compress

一个命令行工具

将 `Notion` 页面所有的图片压缩并重新上传至 `qiniu` `cdn`（`notion` 没有提供上传文件的 `cdn`）

## 使用

```bash
$ npm install -g notion-image-compress
```

```bash
$ nic --help
Usage: nic [options]

将 notion page 页面的图片统一压缩并替换

Options:
  -V, --version                                output the version number
  --NOTION_ACCESS_TOKEN <NOTION-ACCESS_TOKEN>  设置 Notion 的 access token
  --QINIU_ACCESS_KEY <QINIU-ACCESS-KEY>        设置七牛云的 access key
  --QINIU_SECRET_KEY <QINIU-SECRET-KEY>        设置七牛云的 secret key
  -r, --reset                                  重置配置
  -p, --notionPageId <NOTION-PAGE-ID>          设置 Notion 的 page id
  -h, --help  
```
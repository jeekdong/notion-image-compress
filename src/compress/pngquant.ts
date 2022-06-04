import PngQuant from 'pngquant'

export const compress = new PngQuant([192, '--quality', '40-60', '--nofs', '-'])

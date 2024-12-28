import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import { app, dialog, ipcMain } from 'electron'
import { type IPicture, parseFile } from 'music-metadata'
import sharp from 'sharp'

export function imageFormat(uint8Array: Uint8Array) {
  const bytes = uint8Array.subarray(0, 4) // 获取前4个字节
  const hex = Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
    .join(' ')
  if (hex.startsWith('89 50 4E 47')) {
    return 'png'
  }
  else if (hex.startsWith('FF D8 FF')) {
    return 'jpeg'
  }
  else if (hex.startsWith('49 49 2A 00') || hex.startsWith('4D 4D 00 2A')) {
    // return 'tif'
    // chrome 不支持展示 tif 格式, 所以转换为 jpeg
    return 'jpeg'
  }
  else {
    return 'unknown'
  }
}
/**
 * 保存图片数据到本地文件
 * @returns 保存后的图片路径
 */
export async function saveImageToFile(picture: IPicture, filePath: string): Promise<string> {
  if (!picture)
    return ''

  const format = imageFormat(picture.data)
  // 非主流格式不保存
  if (format === 'unknown')
    return ''

  try {
    const fileName = path.basename(filePath).split('.').shift()
    // console.log('======= fileName ( index.ts ) =======\n', fileName)
    // 创建图片保存目录
    const userDataPath = app.getPath('userData')
    const imageDir = path.join(userDataPath, 'images')
    if (!fs.existsSync(imageDir))
      fs.mkdirSync(imageDir, { recursive: true })

    const name = `cover_${fileName}.${format}`
    // 生成图片文件路径
    const imagePath = path.join(imageDir, name)

    // 写入文件
    // eslint-disable-next-line node/prefer-global/buffer
    const imageBuffer = Buffer.from(picture.data)
    await sharp(imageBuffer).toFormat(format).toFile(imagePath)
    // await fs.promises.writeFile(imagePath, imageBuffer)

    // 返回相对于用户数据目录的路径
    return imagePath
  }
  catch (error) {
    console.error('保存图片失败:', error)
    return ''
  }
}

async function scaleImage(filePath: string, imagePath: string) {
  const metadata = await sharp(filePath).metadata()
  const { width, height } = metadata

  const resize = { width: null, height: null }
  width > height ? resize.height = 270 : resize.width = 270

  // 按照计算的新宽高进行缩放
  await sharp(filePath).resize(resize).toFile(imagePath)
}

export async function saveCoverToFile(filePath: string) {
  const userDataPath = app.getPath('userData')
  const imageDir = path.join(userDataPath, 'playlistImages')

  if (!fs.existsSync(imageDir))
    fs.mkdirSync(imageDir, { recursive: true })

  const imagePath = path.join(imageDir, path.basename(filePath))
  await scaleImage(filePath, imagePath)

  return imagePath
}

// 添加这些新函数
export async function processAudioFile(filePath: string) {
  // console.log('======= filePath ( index.ts ) =======\n', path.basename(filePath))
  try {
    const metadata = await parseFile(filePath)
    const picture = metadata.common.picture?.[0]
    // console.log('======= picture ( index.ts ) =======\n', picture)
    // const cover = picture ? `data:${picture.format};base64,${Buffer.from(picture.data).toString('base64')}` : ''

    const coverPath = await saveImageToFile(picture, filePath)
    // console.log('======= coverPath ( index.ts ) =======\n', coverPath)

    return {
      path: filePath,
      title: metadata.common.title || path.basename(filePath).split('.').shift(),
      artist: metadata.common.artist || '未知艺术家',
      album: metadata.common.album || '未知专辑',
      duration: metadata.format.duration,
      cover: coverPath,
    }
  }
  catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error)
    return null
  }
}

export async function processDirectory(dirPath: string) {
  const readdir = promisify(fs.readdir)
  const stat = promisify(fs.stat)

  try {
    const files = await readdir(dirPath)
    const audioFiles = []

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stats = await stat(filePath)

      // eslint-disable-next-line regexp/no-unused-capturing-group
      const isAudioFile = /\.(mp3|m4a|aac|flac|wav|ogg)$/i.test(file)
      if (stats.isFile() && isAudioFile) {
        const metadata = await processAudioFile(filePath)
        if (metadata)
          audioFiles.push(metadata)
      }
    }

    return audioFiles
  }
  catch (error) {
    console.error('处理目录时出错:', error)
    return []
  }
}

// 在 ipcMain 处理程序部分添加
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '音频文件', extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'] },
    ],
  })

  if (result.canceled)
    return []

  const metadataPromises = result.filePaths.map(processAudioFile)
  const metadata = await Promise.all(metadataPromises)
  return metadata.filter(item => item !== null)
})

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  if (result.canceled)
    return []

  return await processDirectory(result.filePaths[0])
})

ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
    ],
  })
  return result.filePaths[0]
})

ipcMain.handle('save-playlist-image', async (_, path: string) => saveCoverToFile(path))

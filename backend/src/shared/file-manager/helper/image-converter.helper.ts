import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import path from 'path';
import fs from 'fs';

@Injectable()
export class ImageConverterHelper {
  async compress(file: Express.Multer.File, outDir = 'temp') {
    const tempDir = path.join(process.cwd(), outDir);
    await fs.promises.mkdir(tempDir, { recursive: true });

    const isHeic = file.originalname.toLowerCase().endsWith('.heic');

    let sourcePath = file.path;

    // 🔹 1. Convert HEIC → JPEG dulu jika perlu
    if (isHeic) {
      const jpegPath = path.join(tempDir, `${path.parse(file.path).name}.jpeg`);

      const inputBuffer = await fs.promises.readFile(file.path);

      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1,
      });

      await fs.promises.writeFile(jpegPath, outputBuffer);
      sourcePath = jpegPath;
    }

    const filename = `${path.parse(sourcePath).name}.webp`;
    const tempResult = path.join(process.cwd(), outDir, filename);

    const result = await sharp(sourcePath)
      .resize(1600, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(tempResult);
    const resultStream = fs.createReadStream(tempResult);

    if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);

    return {
      ...file,
      filename,
      path: tempResult,
      stream: resultStream,
      size: result.size,
      mimetype: 'image/webp',
    }
  }
}
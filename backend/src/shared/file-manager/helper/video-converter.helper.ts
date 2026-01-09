import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

@Injectable()
export class VideoConverterHelper {
  async takeScreenShoot(
    file: Express.Multer.File,
    outDir = 'temp',
    options?: ffmpeg.ScreenshotsConfig,
  ) {
    const filename = `${path.parse(file.path).name}.webp`;
    const tempScreenShoot = path.join(process.cwd(), outDir, filename);
    const tempDir = path.join(process.cwd(), outDir);
    await fs.promises.mkdir(tempDir, { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg(file.path)
        .screenshots({
          timestamps: options?.timestamps ?? ['00:00:01.000'],
          folder: tempDir,
          filename,
          ...options,
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const thumbStream = fs.createReadStream(tempScreenShoot);
    const stats = await fs.promises.stat(tempScreenShoot);

    return {
      filename,
      path: tempScreenShoot,
      stream: thumbStream,
      size: stats.size,
    };
  }

  async compress(file: Express.Multer.File, outDir = 'temp') {
    if (!file.mimetype.startsWith('video/')) return file;

    const filename = `${path.parse(file.path).name}.mp4`;
    const tempVideoCompressed = path.join(process.cwd(), outDir, filename);
    const tempDir = path.join(process.cwd(), outDir);
    await fs.promises.mkdir(tempDir, { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg(file.path)
        .videoCodec('libx264')
        .audioCodec('aac')
        // .videoFilters("scale=1280:-1")
        .outputOptions([
          '-preset veryfast', // kecepatan encode = ukuran lebih kecil
          '-crf 28', // 18 = tinggi (besar), 28 = kecil (kualitas cukup)
          "-b:v 1500k", // paksa bitrate 1.5 Mbps
          "-maxrate 1500k",
          "-bufsize 3000k"
        ])
        .on('end', resolve)
        .on('error', reject)
        .save(tempVideoCompressed);
    });

    const thumbStream = fs.createReadStream(tempVideoCompressed);
    const stats = await fs.promises.stat(tempVideoCompressed);

    return {
      ...file,
      filename,
      path: tempVideoCompressed,
      stream: thumbStream,
      size: stats.size,
    };
  }
}

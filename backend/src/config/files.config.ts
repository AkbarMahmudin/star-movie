import { registerAs } from '@nestjs/config';

export default registerAs('files', () => {
  const imageMimeTypes = process.env.IMAGE_ALLOWED_MIME_TYPES?.split(',') ?? [
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];
  const imageMaxSize = parseInt(process.env.IMAGE_MAX_SIZE || '5');

  const videoMimeTypes = process.env.VIDEO_ALLOWED_MIME_TYPES?.split(',') ?? [
    'video/mp4',
    'video/mpeg',
    'video/webm',
  ];
  const videoMaxSize = parseInt(process.env.VIDEO_MAX_SIZE || '300');

  const documentMimeTypes = process.env.DOCUMENT_ALLOWED_MIME_TYPES?.split(
    ',',
  ) ?? [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const documentMaxSize = parseInt(process.env.DOCUMENT_MAX_SIZE || '10');

  const limitSize = Math.max(imageMaxSize, videoMaxSize, documentMaxSize);

  return {
    dest: process.env.STORAGE_DEST || 'storage',

    default: {
      maxSize: limitSize,
      allowedMimeTypes: [
        ...imageMimeTypes,
        ...videoMimeTypes,
        ...documentMimeTypes,
      ],
    },

    fields: {
      images: {
        maxSize: imageMaxSize,
        allowedMimeTypes: imageMimeTypes,
      },
      videos: {
        maxSize: videoMaxSize,
        allowedMimeTypes: videoMimeTypes,
      },
      documents: {
        maxSize: documentMaxSize,
        allowedMimeTypes: documentMimeTypes,
      },
    },
  };
});

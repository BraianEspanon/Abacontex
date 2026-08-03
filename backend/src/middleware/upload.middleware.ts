import multer from 'multer';

import { BadRequestError } from '../errors/bad-request-error';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(_req, file, callback) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(new BadRequestError('Solo se permite cargar archivos de imagen.'));
    }

    callback(null, true);
  },
});

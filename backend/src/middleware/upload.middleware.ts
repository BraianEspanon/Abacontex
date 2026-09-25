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

const ALLOWED_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const DEFAULT_MAX_DOCUMENT_SIZE_MB = 10;

function getDocumentMaxFileSize(): number {
  const envSize = process.env.OCR_MAX_FILE_SIZE_MB;
  if (envSize) {
    const parsed = Number(envSize);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed * 1024 * 1024;
    }
  }
  return DEFAULT_MAX_DOCUMENT_SIZE_MB * 1024 * 1024;
}

export const uploadDocumento = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: getDocumentMaxFileSize(),
  },

  fileFilter(_req, file, callback) {
    if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestError('Solo se permite cargar archivos de imagen (JPG, PNG, WEBP) o PDF.')
      );
    }

    callback(null, true);
  },
});

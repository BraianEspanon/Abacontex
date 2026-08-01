import cloudinary from './cloudinary.client';
import streamifier from 'streamifier';

import type { UploadedFile } from './storage.types';

export async function upload(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        console.dir(error, { depth: null });
        console.log(JSON.stringify(error, null, 2));
        if (error || !result) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

export async function deleteFile(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(
      `No fue posible eliminar el archivo de Cloudinary. Resultado: ${result.result}`
    );
  }
}

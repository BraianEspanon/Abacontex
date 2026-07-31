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

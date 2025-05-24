import { v2 as cloudinary } from 'cloudinary';

import type { IUploadResult } from './types';

export const deleteImageServer = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, error => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const uploadImageServer = async (
  file: Buffer,
  folder = 'default'
): Promise<IUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            const response = {
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
            };
            resolve(response);
          }
        }
      )
      .end(file);
  });
};

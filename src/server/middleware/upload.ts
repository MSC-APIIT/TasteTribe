import { cloudinary } from '@/server/lib/cloudinary';
import { Readable } from 'stream';

export async function uploadToCloudinary(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'tastetribe',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

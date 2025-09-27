/* eslint-disable no-console */
import { cloudinary } from '@/server/lib/cloudinary';
import { Readable } from 'stream';

export async function uploadToCloudinary(file: File) {
  console.log('[Cloudinary] Upload started');

  console.log('[Cloudinary Config]', cloudinary.config());

  try {
    console.log(
      '[Cloudinary] Converting file to buffer:',
      file.name,
      file.type,
      file.size
    );
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[Cloudinary] Buffer created, size:', buffer.length);

    return new Promise<any>((resolve, reject) => {
      console.log('[Cloudinary] Creating upload stream...');

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
          if (error) {
            console.error('[Cloudinary] Upload failed:', error);
            return reject(error);
          }
          console.log(
            '[Cloudinary] Upload success:',
            result?.public_id,
            result?.secure_url
          );
          resolve(result);
        }
      );

      console.log('[Cloudinary] Piping buffer to upload stream...');
      Readable.from(buffer).pipe(uploadStream);

      uploadStream.on('finish', () => {
        console.log('[Cloudinary] Upload stream finished piping data');
      });

      uploadStream.on('error', (err) => {
        console.error('[Cloudinary] Upload stream error:', err);
        reject(err);
      });
    });
  } catch (err) {
    console.error('[Cloudinary] Unexpected error:', err);
    throw err;
  }
}

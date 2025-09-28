/* eslint-disable no-console */
import { cloudinary } from '@/server/lib/cloudinary';

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

    // ✅ Use base64 data URI instead of stream (works on Vercel)
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'tastetribe',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    console.log(
      '[Cloudinary] Upload success:',
      result?.public_id,
      result?.secure_url
    );

    return result; // return JSON object directly
  } catch (err) {
    console.error('[Cloudinary] Upload failed:', err);
    throw err;
  }
}

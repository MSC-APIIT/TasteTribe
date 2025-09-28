import { cloudinary } from '@/server/lib/cloudinary';

export async function uploadToCloudinary(file: File) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Use base64 data URI instead of stream (cloudinary stram is not works on Vercel)
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'tastetribe',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return result;
  } catch (err) {
    console.error('[Cloudinary] Upload failed:', err);
    throw err;
  }
}

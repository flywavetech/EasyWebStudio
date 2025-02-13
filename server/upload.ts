import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

let cloudinaryConfigured = false;

// Configure Cloudinary only if credentials are available
try {
  // First try individual credentials
  if (process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinaryConfigured = true;
  }
  // If individual credentials aren't available, try CLOUDINARY_URL
  else if (process.env.CLOUDINARY_URL) {
    // Only configure if URL starts with cloudinary://
    if (process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      cloudinaryConfigured = true;
    }
  }
} catch (error) {
  console.warn('Cloudinary configuration failed:', error);
}

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Image upload is unavailable.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'website-builder',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    // Convert buffer to stream and pipe to cloudinary
    const bufferStream = Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  });
}

export async function uploadImages(files: Express.Multer.File[]): Promise<string[]> {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Image upload is unavailable.');
  }
  return Promise.all(files.map(file => uploadImage(file)));
}
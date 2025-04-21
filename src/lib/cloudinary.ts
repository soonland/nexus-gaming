export const cloudinaryConfig = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // Format attendu : https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    const pathname = new URL(url).pathname;
    // Extraire le chemin après "upload/"
    const match = pathname.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;

    // Retirer l'extension du fichier
    const publicId = match[1].replace(/\.[^/.]+$/, '');
    return publicId;
  } catch {
    return null;
  }
};

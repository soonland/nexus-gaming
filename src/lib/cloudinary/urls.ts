/**
 * Crée une URL Cloudinary à partir d'un public_id
 */
export const getCloudinaryUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
) => {
  if (!publicId) return '';

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined');
    return '';
  }

  let transformations = 'q_auto,f_auto'; // Qualité et format automatiques par défaut

  if (options) {
    const { width, height, quality } = options;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    if (quality) transformations += `,q_${quality}`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Vérifie si une URL est une URL Cloudinary valide
 */
export const isCloudinaryUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
};

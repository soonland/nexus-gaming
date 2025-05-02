import slugify from 'slugify';

/**
 * Generates a URL-friendly slug from a given text using slugify
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true, // Convert to lower case
    strict: true, // Strip special characters
    trim: true, // Trim leading and trailing replacement chars
  });
}

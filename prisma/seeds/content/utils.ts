import slugify from 'slugify';

/**
 * Génère un slug déterministe pour un jeu basé sur son index
 */
export function generateGameSlug(index: number): string {
  return `game-${index + 1}`;
}

/**
 * Génère un slug déterministe pour un article basé sur le jeu et son index
 */
export function generateArticleSlug(gameSlug: string, index: number): string {
  return `${gameSlug}-article-${index + 1}`;
}

/**
 * Convertit un titre en slug SEO-friendly
 */
export function slugifyTitle(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'fr',
  });
}

/**
 * Sélectionne un élément déterministe dans un tableau basé sur un index
 */
export function getByIndex<T>(array: T[], index: number): T {
  return array[index % array.length];
}

/**
 * Sélectionne un sous-ensemble déterministe d'éléments dans un tableau basé sur un index
 */
export function getSubsetByIndex<T>(
  array: T[],
  index: number,
  maxItems: number
): T[] {
  const count = (index % maxItems) + 1;
  return array.slice(0, count);
}

/**
 * Remplace les placeholders dans un template avec des valeurs
 */
export function replaceTemplateVars(
  template: string,
  vars: Record<string, string>
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replace(new RegExp(`{${key}}`, 'g'), value),
    template
  );
}

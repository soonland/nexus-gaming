export interface Console {
  id: string;
  name: string;
  manufacturer: string;
  releaseDate: string;
  description?: string;
  generation?: number;
  createdAt: string;
  updatedAt: string;
  games?: {
    id: string;
    title: string;
    releaseDate: string | null;
    coverImage?: string;
  }[];
}

export interface ConsoleFormData {
  name: string;
  manufacturer: string;
  releaseDate: string;
  description?: string;
  generation?: number;
}

export interface ConsoleWithGames extends Console {
  games: {
    id: string;
    title: string;
    releaseDate: string | null;
    coverImage?: string;
  }[];
}

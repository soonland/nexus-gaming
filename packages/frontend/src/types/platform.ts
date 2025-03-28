export interface Platform {
  id: string;
  name: string;
  manufacturer: string;
  releaseDate: string | null;
  createdAt: string;
  updatedAt: string;
  games?: {
    id: string;
    title: string;
  }[];
}

export interface PlatformFormData {
  name: string;
  manufacturer: string;
  releaseDate?: string | null;
}

export interface PlatformWithGames extends Platform {
  games: {
    id: string;
    title: string;
  }[];
}

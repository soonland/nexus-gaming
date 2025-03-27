export interface Game {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  platform: string[];
  publisher: string;
  developer: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number | null;
}

export interface GameFormData {
  title: string;
  description: string;
  releaseDate: string;
  platform: string[];
  publisher: string;
  developer: string;
  coverImage?: string;
}

export interface GameWithDetails extends Game {
  reviews: {
    id: string;
    rating: number;
    content: string;
    user: {
      id: string;
      username: string;
    };
  }[];
  articles: {
    article: {
      id: string;
      title: string;
      publishedAt: string;
      user: {
        username: string;
      };
    };
  }[];
}

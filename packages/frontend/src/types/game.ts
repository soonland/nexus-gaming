export interface Game {
  id: string;
  title?: string;
  description: string;
  releaseDate: string | null;
  releasePeriod?: {
    type: 'date' | 'quarter' | 'month';
    value: string; // YYYY-MM-DD for date, YYYY-QN for quarter, YYYY-MM for month
  };
  platforms: {
    id: string;
    name: string;
    manufacturer: string;
  }[];
  publisher: string;
  developer: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number | null;
}

export interface GameFormData {
  title?: string;
  description: string;
  releaseDate?: string | null;
  releasePeriod?: {
    type: 'date' | 'quarter' | 'month';
    value: string;
  };
  platformIds: string[];
  publisher: string;
  developer: string;
  coverImage?: string;
}

export interface GameWithDetails extends Game {
  title?: string;
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

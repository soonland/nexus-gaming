import type {
  IArticleData,
  ICategoryData,
  ICategoryForm,
  ICompanyData,
  IGameData,
  IPlatformData,
} from './api';

// Legacy types (to be removed once migration is complete)
export type ArticleData = IArticleData;
export type CategoryData = ICategoryData;
export type CategoryForm = ICategoryForm;
export type CompanyData = ICompanyData;
export type GameData = IGameData;
export type PlatformData = IPlatformData;

export * from './api';

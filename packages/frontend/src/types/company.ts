export interface Company {
  id: string;
  name: string;
  isDeveloper: boolean;
  isPublisher: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CompanyFormData = Pick<Company, 'name' | 'isDeveloper' | 'isPublisher'>;

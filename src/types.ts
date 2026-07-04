export interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  closedDay: string;
  services: string;
  area: string;
  image?: string;
  website?: string;
}

export type SortKey = 'id' | 'name-asc' | 'name-desc' | 'category';

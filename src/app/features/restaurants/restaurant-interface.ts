export interface Restaurant {
  id: number;
  name: string;
  address?: string | null;
  telephone?: string | null;
  email?: string | null;
  cuisineType?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  categoryCount: number;
  role: string;
  permissions: string[];
  dishCount: number;
}

export type NewRestaurant = Omit<
  Restaurant,
  'id' | 'categoryCount' | 'role' | 'permissions' | 'dishCount'
>;

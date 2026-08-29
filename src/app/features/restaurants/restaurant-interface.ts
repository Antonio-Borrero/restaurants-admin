export interface Restaurant {
  id: number;
  name: string;
  address: string | null;
  telephone: string | null;
  email: string | null;
  cuisineType: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categoryCount: number;
  role: string;
  permissions: string[];
  dishCount: number;
}

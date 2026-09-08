export interface RestaurantMenu {
  id: number;
  name: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  dishes: Dish[];
}

export interface Dish {
  id: number;
  name: string | null;
  description: string | null;
  originalName: string | null;
  price: string;
  allergens: string[];
  imageUrl: string | null;
}

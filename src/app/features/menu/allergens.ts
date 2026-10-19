export const ALLERGEN_LABELS = {
  Gluten: 'Gluten',
  Crustaceans: 'Crustáceos',
  Eggs: 'Huevos',
  Fish: 'Pescado',
  Peanuts: 'Cacahuetes',
  Soy: 'Soja',
  Milk: 'Leche',
  Nuts: 'Frutos de cáscara',
  Celery: 'Apio',
  Mustard: 'Mostaza',
  Sesame: 'Sésamo',
  Sulphites: 'Sulfitos',
  Lupin: 'Altramuces',
  Molluscs: 'Moluscos',
} as const;

export type Allergen = keyof typeof ALLERGEN_LABELS;
export const ALLERGEN_KEYS = Object.keys(ALLERGEN_LABELS) as Allergen[];

// Object.keys always returns string[]; the cast is safe because the keys come from ALLERGEN_LABELS itself

export function buildAllergensState(selected: readonly string[] = []): Record<Allergen, boolean> {
  return ALLERGEN_KEYS.reduce(
    (acc, allergen) => {
      acc[allergen] = selected.includes(allergen);
      return acc;
    },
    {} as Record<Allergen, boolean>,
  );
}

export function isAllergen(key: string): key is Allergen {
  return key in ALLERGEN_LABELS;
}

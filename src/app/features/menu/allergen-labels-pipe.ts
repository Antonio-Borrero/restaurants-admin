import { Pipe, type PipeTransform } from '@angular/core';
import { Allergen, ALLERGEN_LABELS, isAllergen } from './allergens';

@Pipe({
  name: 'allergenLabels',
})
export class AllergenLabelsPipe implements PipeTransform {
  transform(allergens: readonly string[]): string {
    return allergens
      .map((allergen) => (isAllergen(allergen) ? ALLERGEN_LABELS[allergen] : allergen))
      .join(', ');
  }
}

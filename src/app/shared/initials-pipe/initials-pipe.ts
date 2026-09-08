import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'Initials',
})
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    const words = value.split(' ');
    if (words.length >= 2) {
      return words
        .slice(0, 2)
        .map((word) => word[0])
        .join('');
    }
    return value.slice(0, 2);
  }
}

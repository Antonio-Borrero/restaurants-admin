import { Component, input } from '@angular/core';
import { RestaurantMenu } from '../menu-interface';

@Component({
  selector: 'app-menu-mobile',
  imports: [],
  templateUrl: './menu-mobile.html',
  styleUrl: './menu-mobile.scss',
})
export class MenuMobile {
  public menu = input.required<RestaurantMenu>();
  public categoryCount = input.required<number>();
  public dishCount = input.required<number>();
}

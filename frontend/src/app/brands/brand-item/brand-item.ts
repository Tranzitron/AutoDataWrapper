import {Component, Input} from '@angular/core';
import {BrandViewModel} from '../../../../../library/src/models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-brand-item',
  imports: [],
  templateUrl: './brand-item.html',
  styleUrl: './brand-item.css',
})
export class BrandItem {
  @Input({required: true}) item!: BrandViewModel;

  constructor(public router: Router) {
  }

  public async brandClicked(brandHref: string) {
    await this.router.navigate(["brand", brandHref]);
  }
}

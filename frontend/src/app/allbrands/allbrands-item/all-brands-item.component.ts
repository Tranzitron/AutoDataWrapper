import {Component, Input} from '@angular/core';
import {BrandViewModel} from '../../../../../library/src/models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-allbrands-item',
  imports: [],
  templateUrl: './all-brands-item.component.html',
  styleUrl: './all-brands-item.component.css',
})
export class AllBrandsItemComponent {
  @Input({required: true}) item!: BrandViewModel;

  constructor(public router: Router) {
  }

  public async brandClicked(brandHref: string) {
    await this.router.navigate(["brand", brandHref]);
  }
}

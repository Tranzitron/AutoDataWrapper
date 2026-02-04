import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-allbrands-item',
  imports: [],
  templateUrl: './all-brands-item.component.html',
  styleUrl: './all-brands-item.component.css',
})
export class AllBrandsItemComponent {
  @Input({required: true}) item!: any;

  constructor(public router: Router) {
  }

  public async brandClicked(brandHref: string) {
    await this.router.navigate(["brand", brandHref]);
  }
}

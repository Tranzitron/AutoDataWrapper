import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Brand} from "../../../../../library/src/models";

@Component({
  selector: 'app-allbrands-item',
  imports: [],
  templateUrl: './all-brands-item.component.html',
  styleUrl: './all-brands-item.component.css',
})
export class AllBrandsItemComponent {
  @Input({required: true}) item!: Brand;

  constructor(public router: Router) {
  }

  public async brandClicked() {
    let brandName = this.item.name.replace(" ", "_");
    let brandUrl = brandName + "-" + this.item.id;
    await this.router.navigate(["brand", brandUrl]);
  }
}

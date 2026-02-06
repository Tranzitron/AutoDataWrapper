import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Model} from '../../../../../library/src/models'

@Component({
  selector: 'app-brand-item',
  imports: [],
  templateUrl: './brand-item.component.html',
  styleUrl: './brand-item.component.css',
})
export class BrandItemComponent {
  @Input({required: true}) item!: Model;

  constructor(public router: Router) {
  }

  public async brandClicked() {
    let brandName = this.item.name.replace(" ", "_");
    let brandUrl = brandName + "-" + this.item.id;
    await this.router.navigate(["brand", brandUrl, "model", this.item.url]);
  }
}

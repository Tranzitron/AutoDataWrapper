import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Brand} from "../../../../../library/src/models";
import {SlugifyPipe} from '../../slugify-pipe';

@Component({
  selector: 'app-allbrands-item',
  imports: [],
  templateUrl: './all-brands-item.component.html',
  styleUrl: './all-brands-item.component.css',
  providers: [SlugifyPipe]
})
export class AllBrandsItemComponent {
  @Input({required: true}) item!: Brand;

  constructor(public router: Router, private pipe: SlugifyPipe) {
  }

  public async clicked() {
    let brandName = this.pipe.transform(this.item.name);
    let brandUrl = brandName + "-" + this.item.id;
    await this.router.navigate(["brand", brandUrl]);
  }
}

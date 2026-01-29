import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BrandJsonModel, BrandViewModel} from '../../../../library/src/models';
import {ApiService} from '../data/api.service';
import {AllBrandsItemComponent} from './allbrands-item/all-brands-item.component';

@Component({
  selector: 'app-brands',
  imports: [
    AllBrandsItemComponent
  ],
  templateUrl: './all-brands.component.html',
  styleUrl: './all-brands.component.css',
})
export class AllBrandsComponent implements OnInit {
  brands: BrandViewModel[] = [];

  constructor(public api: ApiService, private changeDetector: ChangeDetectorRef) {
  }

  async ngOnInit() {
    let response: BrandJsonModel = await this.api.getAllBrands();
    this.brands = response.brands;
    this.changeDetector.detectChanges();
    console.log(this.brands);
  }
}

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BrandJsonModel, BrandViewModel} from '../data/models';
import {ApiService} from '../data/api.service';
import {BrandItem} from './brand-item/brand-item';

@Component({
  selector: 'app-brands',
  imports: [
    BrandItem
  ],
  templateUrl: './brands.html',
  styleUrl: './brands.css',
})
export class Brands implements OnInit {
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

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  brands: any[] = [];

  constructor(public api: ApiService, private changeDetector: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.brands = await this.api.getAllBrands();
    this.changeDetector.detectChanges();
    console.log(this.brands);
  }
}

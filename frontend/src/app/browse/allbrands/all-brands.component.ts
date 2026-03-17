import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {AllBrandsItemComponent} from './allbrands-item/all-brands-item.component';
import {Brand} from '../../../../../library/src/models'

@Component({
  selector: 'app-brands',
  imports: [
    AllBrandsItemComponent
  ],
  templateUrl: './all-brands.component.html',
  styleUrl: './all-brands.component.css',
})
export class AllBrandsComponent implements OnInit {
  brands: Brand[] = [];

  constructor(public api: ApiService, private changeDetector: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.brands = await this.api.getAllBrands();
    this.changeDetector.detectChanges();
  }
}

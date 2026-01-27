import {Component, OnInit} from '@angular/core';
import {BrandJsonModel, BrandViewModel} from '../data/models';
import {ApiService} from '../data/api.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  brands: BrandViewModel[] = [];

  constructor(public api: ApiService) {
  }

  async ngOnInit() {
    let response: BrandJsonModel = await this.api.getAllBrands();
    this.brands = response.brands;
    console.log(this.brands);
    //TODO DISPLAY BRANDS
  }
}

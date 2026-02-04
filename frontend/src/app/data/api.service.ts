import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BrandJsonModel} from '../../../../library/src/models';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  serverUrl = "http://localhost:3000/";

  constructor(public http: HttpClient,) {
  }

  async getAllBrands(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(this.serverUrl + 'brands'));
  }

  async getBrand(brandId: number): Promise<BrandJsonModel> {
    return await lastValueFrom(this.http.get<BrandJsonModel>(this.serverUrl + 'getBrand/' + brandId));
  }
}

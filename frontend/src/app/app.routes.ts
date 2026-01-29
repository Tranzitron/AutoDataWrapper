import {Routes} from '@angular/router';
import {AllBrandsComponent} from './allbrands/all-brands.component';
import {BrandComponent} from './brand/brand.component';

export const routes: Routes = [
  {path: 'all-brands', component: AllBrandsComponent},
  {path: 'brand/:id', component: BrandComponent},
  {path: '**', redirectTo: '/all-brands'},
  {path: '*', redirectTo: '/all-brands'}
];

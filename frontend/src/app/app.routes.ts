import {Routes} from '@angular/router';
import {AllBrandsComponent} from './allbrands/all-brands.component';
import {BrandComponent} from './brand/brand.component';

export const routes: Routes = [
  {path: 'brands', component: AllBrandsComponent},
  {path: 'brand/:brandId', component: BrandComponent},
  {path: 'brand/:brandId/model/:modelId', component: BrandComponent},
  // {path: 'brand/:brandId/model/:modelId/generation/:generationId', component: TrimComponent},
  {path: '**', redirectTo: '/brands'},
  {path: '*', redirectTo: '/brands'}
];

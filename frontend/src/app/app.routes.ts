import {Routes} from '@angular/router';
import {AllBrandsComponent} from './allbrands/all-brands.component';
import {BrandComponent} from './brand/brand.component';
import {ModelComponent} from './model/model.component';
import {GenerationComponent} from './generation/generation.component';

export const routes: Routes = [
  {path: 'brands', component: AllBrandsComponent},
  {path: 'brand/:brandId', component: BrandComponent},
  {path: 'brand/:brandId/model/:modelId', component: ModelComponent},
  {path: 'brand/:brandId/model/:modelId/generation/:generationId', component: GenerationComponent},
  {path: '**', redirectTo: '/brands'},
  {path: '*', redirectTo: '/brands'}
];

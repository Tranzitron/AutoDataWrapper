import {Routes} from '@angular/router';
import {AllBrandsComponent} from './browse/allbrands/all-brands.component';
import {BrandComponent} from './browse/brand/brand.component';
import {ModelComponent} from './browse/model/model.component';
import {GenerationComponent} from './browse/generation/generation.component';
import {BrowseComponent} from './browse/browse.component';

export const routes: Routes = [
  {
    path: 'browse', component: BrowseComponent, children:
      [
        {path: '', component: AllBrandsComponent},
        {path: ':brandId', component: BrandComponent},
        {path: ':brandId/:modelId', component: ModelComponent},
        {path: ':brandId/:modelId/:generationId', component: GenerationComponent},
      ]
  },
  {path: '**', redirectTo: '/browse'},
  {path: '*', redirectTo: '/browse'}
];

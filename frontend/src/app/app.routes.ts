import {Routes} from '@angular/router';
import {AllBrandsComponent} from './browse/all-brands/all-brands.component';
import {BrandComponent} from './browse/brand/brand.component';
import {ModelComponent} from './browse/model/model.component';
import {GenerationComponent} from './browse/generation/generation.component';
import {BrowseComponent} from './browse/browse.component';
import {TrimDetailsComponent} from './browse/trim-details/trim-details.component';

export const routes: Routes = [
  {
    path: 'browse', component: BrowseComponent, children:
      [
        {path: '', component: AllBrandsComponent},
        {path: ':brandId', component: BrandComponent},
        {path: ':brandId/:modelId', component: ModelComponent},
        {path: ':brandId/:modelId/:generationId', component: GenerationComponent},
        {path: ':brandId/:modelId/:generationId/:trimId', component: TrimDetailsComponent},
      ]
  },
  {path: '**', redirectTo: '/browse'},
  {path: '*', redirectTo: '/browse'}
];

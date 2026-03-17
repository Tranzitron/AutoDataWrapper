import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Generation} from "../../../../../library/src/models";
import {SlugifyPipe} from '../../slugify-pipe';

@Component({
  selector: 'app-model-item',
  imports: [],
  templateUrl: './model-item.component.html',
  styleUrl: './model-item.component.css',
  providers: [SlugifyPipe]
})
export class ModelItemComponent {
  @Input({required: true}) item!: Generation;

  constructor(public router: Router, private route: ActivatedRoute, private pipe: SlugifyPipe) {
  }

  public async clicked() {
    let generationName = this.pipe.transform(this.item.name);
    let generationUrl = generationName + "-" + this.item.id;
    await this.router.navigate(["generation", generationUrl], {relativeTo: this.route});
  }
}

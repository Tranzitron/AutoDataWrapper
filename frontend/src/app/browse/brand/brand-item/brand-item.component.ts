import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Model} from '../../../../../../library/src/models'
import {SlugifyPipe} from '../../../slugify-pipe';

@Component({
  selector: 'app-brand-item',
  imports: [],
  templateUrl: './brand-item.component.html',
  styleUrl: './brand-item.component.css',
  providers: [SlugifyPipe]
})
export class BrandItemComponent {
  @Input({required: true}) item!: Model;

  constructor(public router: Router, private route: ActivatedRoute, private pipe: SlugifyPipe) {
  }

  public async clicked() {
    let modelName = this.pipe.transform(this.item.name);
    let modelUrl = modelName + "-" + this.item.id;
    await this.router.navigate([modelUrl], {relativeTo: this.route});
  }
}

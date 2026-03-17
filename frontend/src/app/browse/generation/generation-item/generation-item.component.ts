import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Trim} from "../../../../../../library/src/models";
import {SlugifyPipe} from '../../../slugify-pipe';

@Component({
  selector: 'app-generation-item',
  imports: [],
  templateUrl: './generation-item.component.html',
  styleUrl: './generation-item.component.css',
  providers: [SlugifyPipe]
})
export class GenerationItemComponent {
  @Input({required: true}) item!: Trim;

  constructor(public router: Router, private route: ActivatedRoute, private pipe: SlugifyPipe) {
  }

  public async clicked() {
    let trimName = this.pipe.transform(this.item.name);
    let trimUrl = trimName + "-" + this.item.id;
    await this.router.navigate([trimUrl], {relativeTo: this.route});
  }
}

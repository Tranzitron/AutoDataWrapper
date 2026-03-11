import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Generation} from "../../../../../library/src/models";

@Component({
  selector: 'app-model-item',
  imports: [],
  templateUrl: './model-item.component.html',
  styleUrl: './model-item.component.css',
})
export class ModelItemComponent {
  @Input({required: true}) item!: Generation;

  constructor(public router: Router, private route: ActivatedRoute) {
  }

  public async clicked() {
    let generationName = this.item.name.replace(" ", "_");
    let generationUrl = generationName + "-" + this.item.id;
    await this.router.navigate(["generation", generationUrl], {relativeTo: this.route});
  }
}

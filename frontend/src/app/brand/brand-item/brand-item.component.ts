import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Model} from '../../../../../library/src/models'

@Component({
  selector: 'app-brand-item',
  imports: [],
  templateUrl: './brand-item.component.html',
  styleUrl: './brand-item.component.css',
})
export class BrandItemComponent {
  @Input({required: true}) item!: Model;

  constructor(public router: Router, private route: ActivatedRoute) {
  }

  public async clicked() {
    let modelName = this.item.name.replace(" ", "_");
    let modelUrl = modelName + "-" + this.item.id;
    await this.router.navigate(["model", modelUrl], {relativeTo: this.route});
  }
}

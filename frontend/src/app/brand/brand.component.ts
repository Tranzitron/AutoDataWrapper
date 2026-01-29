import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-brand.component',
  imports: [],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  async ngOnInit() {
    let url: string = this.route.snapshot.params["id"];
  }
}

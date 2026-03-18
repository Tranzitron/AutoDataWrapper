import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../api.service';
import {Trim} from "../../../../../library/src/models";

@Component({
  selector: 'app-trim',
  imports: [],
  templateUrl: './trim-details.component.html',
  styleUrl: './trim-details.component.css',
})
export class TrimDetailsComponent implements OnInit {
  trim: Trim | undefined;

  constructor(private route: ActivatedRoute, public api: ApiService, public router: Router, private changeDetector: ChangeDetectorRef) {
  }

  async ngOnInit() {
    let trimUrl: string = this.route.snapshot.params["trimId"];
    let trimId: number = parseInt(trimUrl.split("-")[1]);
    this.trim = await this.api.getTrimDetails(trimId);
    if (!this.trim) {
      console.log(`no trim found for: ${trimUrl}`);
      await this.router.navigate([""]);
    }

    this.changeDetector.detectChanges();
  }
}

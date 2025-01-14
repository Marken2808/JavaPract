import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILand } from '../land.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-land-detail',
  templateUrl: './land-detail.component.html',
})
export class LandDetailComponent implements OnInit {
  land: ILand | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ land }) => {
      this.land = land;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}

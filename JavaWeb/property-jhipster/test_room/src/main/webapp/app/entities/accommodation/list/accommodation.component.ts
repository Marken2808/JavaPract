import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccommodation } from '../accommodation.model';
import { AccommodationService } from '../service/accommodation.service';
import { AccommodationDeleteDialogComponent } from '../delete/accommodation-delete-dialog.component';

@Component({
  selector: 'jhi-accommodation',
  templateUrl: './accommodation.component.html',
})
export class AccommodationComponent implements OnInit {
  accommodations?: IAccommodation[];
  isLoading = false;

  constructor(protected accommodationService: AccommodationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accommodationService.query().subscribe({
      next: (res: HttpResponse<IAccommodation[]>) => {
        this.isLoading = false;
        this.accommodations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAccommodation): number {
    return item.id!;
  }

  delete(accommodation: IAccommodation): void {
    const modalRef = this.modalService.open(AccommodationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accommodation = accommodation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
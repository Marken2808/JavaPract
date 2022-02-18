import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAccommodation, Accommodation } from '../accommodation.model';
import { AccommodationService } from '../service/accommodation.service';
import { AccommodationType } from 'app/entities/enumerations/accommodation-type.model';
import { AccommodationStatus } from 'app/entities/enumerations/accommodation-status.model';

@Component({
  selector: 'jhi-accommodation-update',
  templateUrl: './accommodation-update.component.html',
})
export class AccommodationUpdateComponent implements OnInit {
  isSaving = false;
  accommodationTypeValues = Object.keys(AccommodationType);
  accommodationStatusValues = Object.keys(AccommodationStatus);

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    type: [null, [Validators.required]],
    status: [null, [Validators.required]],
  });

  constructor(protected accommodationService: AccommodationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accommodation }) => {
      this.updateForm(accommodation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accommodation = this.createFromForm();
    if (accommodation.id !== undefined) {
      this.subscribeToSaveResponse(this.accommodationService.update(accommodation));
    } else {
      this.subscribeToSaveResponse(this.accommodationService.create(accommodation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccommodation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(accommodation: IAccommodation): void {
    this.editForm.patchValue({
      id: accommodation.id,
      title: accommodation.title,
      type: accommodation.type,
      status: accommodation.status,
    });
  }

  protected createFromForm(): IAccommodation {
    return {
      ...new Accommodation(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      type: this.editForm.get(['type'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
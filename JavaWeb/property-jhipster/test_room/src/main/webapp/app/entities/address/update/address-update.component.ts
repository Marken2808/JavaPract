import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAddress, Address } from '../address.model';
import { AddressService } from '../service/address.service';
import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html',
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;

  propertiesCollection: IProperty[] = [];

  editForm = this.fb.group({
    id: [],
    numberic: [],
    street: [null, [Validators.required]],
    county: [],
    city: [],
    postcode: [],
    country: [],
    property: [null, Validators.required],
  });

  constructor(
    protected addressService: AddressService,
    protected propertyService: PropertyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.updateForm(address);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.createFromForm();
    if (address.id !== undefined) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  trackPropertyById(index: number, item: IProperty): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
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

  protected updateForm(address: IAddress): void {
    this.editForm.patchValue({
      id: address.id,
      numberic: address.numberic,
      street: address.street,
      county: address.county,
      city: address.city,
      postcode: address.postcode,
      country: address.country,
      property: address.property,
    });

    this.propertiesCollection = this.propertyService.addPropertyToCollectionIfMissing(this.propertiesCollection, address.property);
  }

  protected loadRelationshipsOptions(): void {
    this.propertyService
      .query({ filter: 'address-is-null' })
      .pipe(map((res: HttpResponse<IProperty[]>) => res.body ?? []))
      .pipe(
        map((properties: IProperty[]) =>
          this.propertyService.addPropertyToCollectionIfMissing(properties, this.editForm.get('property')!.value)
        )
      )
      .subscribe((properties: IProperty[]) => (this.propertiesCollection = properties));
  }

  protected createFromForm(): IAddress {
    return {
      ...new Address(),
      id: this.editForm.get(['id'])!.value,
      numberic: this.editForm.get(['numberic'])!.value,
      street: this.editForm.get(['street'])!.value,
      county: this.editForm.get(['county'])!.value,
      city: this.editForm.get(['city'])!.value,
      postcode: this.editForm.get(['postcode'])!.value,
      country: this.editForm.get(['country'])!.value,
      property: this.editForm.get(['property'])!.value,
    };
  }
}

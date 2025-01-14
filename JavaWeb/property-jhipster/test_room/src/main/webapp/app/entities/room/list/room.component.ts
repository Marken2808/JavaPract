import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoom } from '../room.model';
import { RoomService } from '../service/room.service';
import { RoomDeleteDialogComponent } from '../delete/room-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-room',
  templateUrl: './room.component.html',
})
export class RoomComponent implements OnInit {
  rooms?: IRoom[];
  isLoading = false;

  constructor(protected roomService: RoomService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.roomService.query().subscribe({
      next: (res: HttpResponse<IRoom[]>) => {
        this.isLoading = false;
        this.rooms = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRoom): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(room: IRoom): void {
    const modalRef = this.modalService.open(RoomDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.room = room;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

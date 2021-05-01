import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResouce } from '../resouce.model';
import { ResouceService } from '../service/resouce.service';
import { ResouceDeleteDialogComponent } from '../delete/resouce-delete-dialog.component';

@Component({
  selector: 'jhi-resouce',
  templateUrl: './resouce.component.html',
})
export class ResouceComponent implements OnInit {
  resouces?: IResouce[];
  isLoading = false;

  constructor(protected resouceService: ResouceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.resouceService.query().subscribe(
      (res: HttpResponse<IResouce[]>) => {
        this.isLoading = false;
        this.resouces = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IResouce): number {
    return item.id!;
  }

  delete(resouce: IResouce): void {
    const modalRef = this.modalService.open(ResouceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resouce = resouce;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

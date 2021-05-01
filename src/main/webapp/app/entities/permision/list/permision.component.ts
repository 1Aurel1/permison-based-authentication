import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPermision } from '../permision.model';
import { PermisionService } from '../service/permision.service';
import { PermisionDeleteDialogComponent } from '../delete/permision-delete-dialog.component';

@Component({
  selector: 'jhi-permision',
  templateUrl: './permision.component.html',
})
export class PermisionComponent implements OnInit {
  permisions?: IPermision[];
  isLoading = false;

  constructor(protected permisionService: PermisionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.permisionService.query().subscribe(
      (res: HttpResponse<IPermision[]>) => {
        this.isLoading = false;
        this.permisions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPermision): number {
    return item.id!;
  }

  delete(permision: IPermision): void {
    const modalRef = this.modalService.open(PermisionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.permision = permision;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

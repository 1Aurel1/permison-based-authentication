import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRolee } from '../rolee.model';
import { RoleeService } from '../service/rolee.service';
import { RoleeDeleteDialogComponent } from '../delete/rolee-delete-dialog.component';

@Component({
  selector: 'jhi-rolee',
  templateUrl: './rolee.component.html',
})
export class RoleeComponent implements OnInit {
  rolees?: IRolee[];
  isLoading = false;

  constructor(protected roleeService: RoleeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.roleeService.query().subscribe(
      (res: HttpResponse<IRolee[]>) => {
        this.isLoading = false;
        this.rolees = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRolee): number {
    return item.id!;
  }

  delete(rolee: IRolee): void {
    const modalRef = this.modalService.open(RoleeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rolee = rolee;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

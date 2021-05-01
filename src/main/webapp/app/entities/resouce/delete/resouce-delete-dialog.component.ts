import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IResouce } from '../resouce.model';
import { ResouceService } from '../service/resouce.service';

@Component({
  templateUrl: './resouce-delete-dialog.component.html',
})
export class ResouceDeleteDialogComponent {
  resouce?: IResouce;

  constructor(protected resouceService: ResouceService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resouceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

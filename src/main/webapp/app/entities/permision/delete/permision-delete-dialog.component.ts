import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPermision } from '../permision.model';
import { PermisionService } from '../service/permision.service';

@Component({
  templateUrl: './permision-delete-dialog.component.html',
})
export class PermisionDeleteDialogComponent {
  permision?: IPermision;

  constructor(protected permisionService: PermisionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.permisionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

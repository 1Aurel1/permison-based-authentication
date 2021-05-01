import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRolee } from '../rolee.model';
import { RoleeService } from '../service/rolee.service';

@Component({
  templateUrl: './rolee-delete-dialog.component.html',
})
export class RoleeDeleteDialogComponent {
  rolee?: IRolee;

  constructor(protected roleeService: RoleeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.roleeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

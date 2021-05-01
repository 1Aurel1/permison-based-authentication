import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RoleeComponent } from './list/rolee.component';
import { RoleeDetailComponent } from './detail/rolee-detail.component';
import { RoleeUpdateComponent } from './update/rolee-update.component';
import { RoleeDeleteDialogComponent } from './delete/rolee-delete-dialog.component';
import { RoleeRoutingModule } from './route/rolee-routing.module';

@NgModule({
  imports: [SharedModule, RoleeRoutingModule],
  declarations: [RoleeComponent, RoleeDetailComponent, RoleeUpdateComponent, RoleeDeleteDialogComponent],
  entryComponents: [RoleeDeleteDialogComponent],
})
export class RoleeModule {}

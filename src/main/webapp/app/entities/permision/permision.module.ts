import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PermisionComponent } from './list/permision.component';
import { PermisionDetailComponent } from './detail/permision-detail.component';
import { PermisionUpdateComponent } from './update/permision-update.component';
import { PermisionDeleteDialogComponent } from './delete/permision-delete-dialog.component';
import { PermisionRoutingModule } from './route/permision-routing.module';

@NgModule({
  imports: [SharedModule, PermisionRoutingModule],
  declarations: [PermisionComponent, PermisionDetailComponent, PermisionUpdateComponent, PermisionDeleteDialogComponent],
  entryComponents: [PermisionDeleteDialogComponent],
})
export class PermisionModule {}

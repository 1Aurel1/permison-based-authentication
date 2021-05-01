import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ResouceComponent } from './list/resouce.component';
import { ResouceDetailComponent } from './detail/resouce-detail.component';
import { ResouceUpdateComponent } from './update/resouce-update.component';
import { ResouceDeleteDialogComponent } from './delete/resouce-delete-dialog.component';
import { ResouceRoutingModule } from './route/resouce-routing.module';

@NgModule({
  imports: [SharedModule, ResouceRoutingModule],
  declarations: [ResouceComponent, ResouceDetailComponent, ResouceUpdateComponent, ResouceDeleteDialogComponent],
  entryComponents: [ResouceDeleteDialogComponent],
})
export class ResouceModule {}

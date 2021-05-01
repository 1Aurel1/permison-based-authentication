import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoleeComponent } from '../list/rolee.component';
import { RoleeDetailComponent } from '../detail/rolee-detail.component';
import { RoleeUpdateComponent } from '../update/rolee-update.component';
import { RoleeRoutingResolveService } from './rolee-routing-resolve.service';

const roleeRoute: Routes = [
  {
    path: '',
    component: RoleeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoleeDetailComponent,
    resolve: {
      rolee: RoleeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoleeUpdateComponent,
    resolve: {
      rolee: RoleeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoleeUpdateComponent,
    resolve: {
      rolee: RoleeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roleeRoute)],
  exports: [RouterModule],
})
export class RoleeRoutingModule {}

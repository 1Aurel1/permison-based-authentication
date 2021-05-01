import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PermisionComponent } from '../list/permision.component';
import { PermisionDetailComponent } from '../detail/permision-detail.component';
import { PermisionUpdateComponent } from '../update/permision-update.component';
import { PermisionRoutingResolveService } from './permision-routing-resolve.service';

const permisionRoute: Routes = [
  {
    path: '',
    component: PermisionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PermisionDetailComponent,
    resolve: {
      permision: PermisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PermisionUpdateComponent,
    resolve: {
      permision: PermisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PermisionUpdateComponent,
    resolve: {
      permision: PermisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(permisionRoute)],
  exports: [RouterModule],
})
export class PermisionRoutingModule {}

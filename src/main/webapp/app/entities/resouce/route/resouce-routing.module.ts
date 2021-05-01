import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ResouceComponent } from '../list/resouce.component';
import { ResouceDetailComponent } from '../detail/resouce-detail.component';
import { ResouceUpdateComponent } from '../update/resouce-update.component';
import { ResouceRoutingResolveService } from './resouce-routing-resolve.service';

const resouceRoute: Routes = [
  {
    path: '',
    component: ResouceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResouceDetailComponent,
    resolve: {
      resouce: ResouceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResouceUpdateComponent,
    resolve: {
      resouce: ResouceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResouceUpdateComponent,
    resolve: {
      resouce: ResouceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(resouceRoute)],
  exports: [RouterModule],
})
export class ResouceRoutingModule {}

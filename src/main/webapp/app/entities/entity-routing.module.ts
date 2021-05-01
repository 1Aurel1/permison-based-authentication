import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'permision',
        data: { pageTitle: 'authApp.permision.home.title' },
        loadChildren: () => import('./permision/permision.module').then(m => m.PermisionModule),
      },
      {
        path: 'resouce',
        data: { pageTitle: 'authApp.resouce.home.title' },
        loadChildren: () => import('./resouce/resouce.module').then(m => m.ResouceModule),
      },
      {
        path: 'rolee',
        data: { pageTitle: 'authApp.rolee.home.title' },
        loadChildren: () => import('./rolee/rolee.module').then(m => m.RoleeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRolee, Rolee } from '../rolee.model';
import { RoleeService } from '../service/rolee.service';

@Injectable({ providedIn: 'root' })
export class RoleeRoutingResolveService implements Resolve<IRolee> {
  constructor(protected service: RoleeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRolee> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rolee: HttpResponse<Rolee>) => {
          if (rolee.body) {
            return of(rolee.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Rolee());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPermision, Permision } from '../permision.model';
import { PermisionService } from '../service/permision.service';

@Injectable({ providedIn: 'root' })
export class PermisionRoutingResolveService implements Resolve<IPermision> {
  constructor(protected service: PermisionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPermision> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((permision: HttpResponse<Permision>) => {
          if (permision.body) {
            return of(permision.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Permision());
  }
}

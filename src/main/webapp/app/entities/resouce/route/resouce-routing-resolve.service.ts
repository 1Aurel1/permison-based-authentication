import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResouce, Resouce } from '../resouce.model';
import { ResouceService } from '../service/resouce.service';

@Injectable({ providedIn: 'root' })
export class ResouceRoutingResolveService implements Resolve<IResouce> {
  constructor(protected service: ResouceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResouce> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((resouce: HttpResponse<Resouce>) => {
          if (resouce.body) {
            return of(resouce.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Resouce());
  }
}

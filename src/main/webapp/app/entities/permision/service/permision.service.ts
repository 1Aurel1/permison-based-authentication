import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPermision, getPermisionIdentifier } from '../permision.model';

export type EntityResponseType = HttpResponse<IPermision>;
export type EntityArrayResponseType = HttpResponse<IPermision[]>;

@Injectable({ providedIn: 'root' })
export class PermisionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/permisions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(permision: IPermision): Observable<EntityResponseType> {
    return this.http.post<IPermision>(this.resourceUrl, permision, { observe: 'response' });
  }

  update(permision: IPermision): Observable<EntityResponseType> {
    return this.http.put<IPermision>(`${this.resourceUrl}/${getPermisionIdentifier(permision) as number}`, permision, {
      observe: 'response',
    });
  }

  partialUpdate(permision: IPermision): Observable<EntityResponseType> {
    return this.http.patch<IPermision>(`${this.resourceUrl}/${getPermisionIdentifier(permision) as number}`, permision, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPermision>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPermision[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPermisionToCollectionIfMissing(
    permisionCollection: IPermision[],
    ...permisionsToCheck: (IPermision | null | undefined)[]
  ): IPermision[] {
    const permisions: IPermision[] = permisionsToCheck.filter(isPresent);
    if (permisions.length > 0) {
      const permisionCollectionIdentifiers = permisionCollection.map(permisionItem => getPermisionIdentifier(permisionItem)!);
      const permisionsToAdd = permisions.filter(permisionItem => {
        const permisionIdentifier = getPermisionIdentifier(permisionItem);
        if (permisionIdentifier == null || permisionCollectionIdentifiers.includes(permisionIdentifier)) {
          return false;
        }
        permisionCollectionIdentifiers.push(permisionIdentifier);
        return true;
      });
      return [...permisionsToAdd, ...permisionCollection];
    }
    return permisionCollection;
  }
}

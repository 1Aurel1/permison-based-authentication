import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResouce, getResouceIdentifier } from '../resouce.model';

export type EntityResponseType = HttpResponse<IResouce>;
export type EntityArrayResponseType = HttpResponse<IResouce[]>;

@Injectable({ providedIn: 'root' })
export class ResouceService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/resouces');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(resouce: IResouce): Observable<EntityResponseType> {
    return this.http.post<IResouce>(this.resourceUrl, resouce, { observe: 'response' });
  }

  update(resouce: IResouce): Observable<EntityResponseType> {
    return this.http.put<IResouce>(`${this.resourceUrl}/${getResouceIdentifier(resouce) as number}`, resouce, { observe: 'response' });
  }

  partialUpdate(resouce: IResouce): Observable<EntityResponseType> {
    return this.http.patch<IResouce>(`${this.resourceUrl}/${getResouceIdentifier(resouce) as number}`, resouce, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResouce>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResouce[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addResouceToCollectionIfMissing(resouceCollection: IResouce[], ...resoucesToCheck: (IResouce | null | undefined)[]): IResouce[] {
    const resouces: IResouce[] = resoucesToCheck.filter(isPresent);
    if (resouces.length > 0) {
      const resouceCollectionIdentifiers = resouceCollection.map(resouceItem => getResouceIdentifier(resouceItem)!);
      const resoucesToAdd = resouces.filter(resouceItem => {
        const resouceIdentifier = getResouceIdentifier(resouceItem);
        if (resouceIdentifier == null || resouceCollectionIdentifiers.includes(resouceIdentifier)) {
          return false;
        }
        resouceCollectionIdentifiers.push(resouceIdentifier);
        return true;
      });
      return [...resoucesToAdd, ...resouceCollection];
    }
    return resouceCollection;
  }
}

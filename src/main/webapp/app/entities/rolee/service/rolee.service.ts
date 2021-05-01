import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRolee, getRoleeIdentifier } from '../rolee.model';

export type EntityResponseType = HttpResponse<IRolee>;
export type EntityArrayResponseType = HttpResponse<IRolee[]>;

@Injectable({ providedIn: 'root' })
export class RoleeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/rolees');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(rolee: IRolee): Observable<EntityResponseType> {
    return this.http.post<IRolee>(this.resourceUrl, rolee, { observe: 'response' });
  }

  update(rolee: IRolee): Observable<EntityResponseType> {
    return this.http.put<IRolee>(`${this.resourceUrl}/${getRoleeIdentifier(rolee) as number}`, rolee, { observe: 'response' });
  }

  partialUpdate(rolee: IRolee): Observable<EntityResponseType> {
    return this.http.patch<IRolee>(`${this.resourceUrl}/${getRoleeIdentifier(rolee) as number}`, rolee, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRolee>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRolee[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRoleeToCollectionIfMissing(roleeCollection: IRolee[], ...roleesToCheck: (IRolee | null | undefined)[]): IRolee[] {
    const rolees: IRolee[] = roleesToCheck.filter(isPresent);
    if (rolees.length > 0) {
      const roleeCollectionIdentifiers = roleeCollection.map(roleeItem => getRoleeIdentifier(roleeItem)!);
      const roleesToAdd = rolees.filter(roleeItem => {
        const roleeIdentifier = getRoleeIdentifier(roleeItem);
        if (roleeIdentifier == null || roleeCollectionIdentifiers.includes(roleeIdentifier)) {
          return false;
        }
        roleeCollectionIdentifiers.push(roleeIdentifier);
        return true;
      });
      return [...roleesToAdd, ...roleeCollection];
    }
    return roleeCollection;
  }
}

jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPermision, Permision } from '../permision.model';
import { PermisionService } from '../service/permision.service';

import { PermisionRoutingResolveService } from './permision-routing-resolve.service';

describe('Service Tests', () => {
  describe('Permision routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PermisionRoutingResolveService;
    let service: PermisionService;
    let resultPermision: IPermision | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PermisionRoutingResolveService);
      service = TestBed.inject(PermisionService);
      resultPermision = undefined;
    });

    describe('resolve', () => {
      it('should return IPermision returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPermision = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPermision).toEqual({ id: 123 });
      });

      it('should return new IPermision if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPermision = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPermision).toEqual(new Permision());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPermision = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPermision).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

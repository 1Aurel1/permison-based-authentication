import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPermision, Permision } from '../permision.model';

import { PermisionService } from './permision.service';

describe('Service Tests', () => {
  describe('Permision Service', () => {
    let service: PermisionService;
    let httpMock: HttpTestingController;
    let elemDefault: IPermision;
    let expectedResult: IPermision | IPermision[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PermisionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Permision', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Permision()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Permision', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Permision', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          new Permision()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Permision', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Permision', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPermisionToCollectionIfMissing', () => {
        it('should add a Permision to an empty array', () => {
          const permision: IPermision = { id: 123 };
          expectedResult = service.addPermisionToCollectionIfMissing([], permision);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(permision);
        });

        it('should not add a Permision to an array that contains it', () => {
          const permision: IPermision = { id: 123 };
          const permisionCollection: IPermision[] = [
            {
              ...permision,
            },
            { id: 456 },
          ];
          expectedResult = service.addPermisionToCollectionIfMissing(permisionCollection, permision);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Permision to an array that doesn't contain it", () => {
          const permision: IPermision = { id: 123 };
          const permisionCollection: IPermision[] = [{ id: 456 }];
          expectedResult = service.addPermisionToCollectionIfMissing(permisionCollection, permision);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(permision);
        });

        it('should add only unique Permision to an array', () => {
          const permisionArray: IPermision[] = [{ id: 123 }, { id: 456 }, { id: 31313 }];
          const permisionCollection: IPermision[] = [{ id: 123 }];
          expectedResult = service.addPermisionToCollectionIfMissing(permisionCollection, ...permisionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const permision: IPermision = { id: 123 };
          const permision2: IPermision = { id: 456 };
          expectedResult = service.addPermisionToCollectionIfMissing([], permision, permision2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(permision);
          expect(expectedResult).toContain(permision2);
        });

        it('should accept null and undefined values', () => {
          const permision: IPermision = { id: 123 };
          expectedResult = service.addPermisionToCollectionIfMissing([], null, permision, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(permision);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

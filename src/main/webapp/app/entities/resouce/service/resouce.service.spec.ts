import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResouce, Resouce } from '../resouce.model';

import { ResouceService } from './resouce.service';

describe('Service Tests', () => {
  describe('Resouce Service', () => {
    let service: ResouceService;
    let httpMock: HttpTestingController;
    let elemDefault: IResouce;
    let expectedResult: IResouce | IResouce[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ResouceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        address: 'AAAAAAA',
        method: 'AAAAAAA',
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

      it('should create a Resouce', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Resouce()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Resouce', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            address: 'BBBBBB',
            method: 'BBBBBB',
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

      it('should partial update a Resouce', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
          },
          new Resouce()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Resouce', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            address: 'BBBBBB',
            method: 'BBBBBB',
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

      it('should delete a Resouce', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addResouceToCollectionIfMissing', () => {
        it('should add a Resouce to an empty array', () => {
          const resouce: IResouce = { id: 123 };
          expectedResult = service.addResouceToCollectionIfMissing([], resouce);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(resouce);
        });

        it('should not add a Resouce to an array that contains it', () => {
          const resouce: IResouce = { id: 123 };
          const resouceCollection: IResouce[] = [
            {
              ...resouce,
            },
            { id: 456 },
          ];
          expectedResult = service.addResouceToCollectionIfMissing(resouceCollection, resouce);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Resouce to an array that doesn't contain it", () => {
          const resouce: IResouce = { id: 123 };
          const resouceCollection: IResouce[] = [{ id: 456 }];
          expectedResult = service.addResouceToCollectionIfMissing(resouceCollection, resouce);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(resouce);
        });

        it('should add only unique Resouce to an array', () => {
          const resouceArray: IResouce[] = [{ id: 123 }, { id: 456 }, { id: 73555 }];
          const resouceCollection: IResouce[] = [{ id: 123 }];
          expectedResult = service.addResouceToCollectionIfMissing(resouceCollection, ...resouceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const resouce: IResouce = { id: 123 };
          const resouce2: IResouce = { id: 456 };
          expectedResult = service.addResouceToCollectionIfMissing([], resouce, resouce2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(resouce);
          expect(expectedResult).toContain(resouce2);
        });

        it('should accept null and undefined values', () => {
          const resouce: IResouce = { id: 123 };
          expectedResult = service.addResouceToCollectionIfMissing([], null, resouce, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(resouce);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

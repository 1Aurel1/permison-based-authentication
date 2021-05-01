import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRolee, Rolee } from '../rolee.model';

import { RoleeService } from './rolee.service';

describe('Service Tests', () => {
  describe('Rolee Service', () => {
    let service: RoleeService;
    let httpMock: HttpTestingController;
    let elemDefault: IRolee;
    let expectedResult: IRolee | IRolee[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RoleeService);
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

      it('should create a Rolee', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Rolee()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Rolee', () => {
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

      it('should partial update a Rolee', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Rolee()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Rolee', () => {
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

      it('should delete a Rolee', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRoleeToCollectionIfMissing', () => {
        it('should add a Rolee to an empty array', () => {
          const rolee: IRolee = { id: 123 };
          expectedResult = service.addRoleeToCollectionIfMissing([], rolee);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rolee);
        });

        it('should not add a Rolee to an array that contains it', () => {
          const rolee: IRolee = { id: 123 };
          const roleeCollection: IRolee[] = [
            {
              ...rolee,
            },
            { id: 456 },
          ];
          expectedResult = service.addRoleeToCollectionIfMissing(roleeCollection, rolee);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Rolee to an array that doesn't contain it", () => {
          const rolee: IRolee = { id: 123 };
          const roleeCollection: IRolee[] = [{ id: 456 }];
          expectedResult = service.addRoleeToCollectionIfMissing(roleeCollection, rolee);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rolee);
        });

        it('should add only unique Rolee to an array', () => {
          const roleeArray: IRolee[] = [{ id: 123 }, { id: 456 }, { id: 93553 }];
          const roleeCollection: IRolee[] = [{ id: 123 }];
          expectedResult = service.addRoleeToCollectionIfMissing(roleeCollection, ...roleeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const rolee: IRolee = { id: 123 };
          const rolee2: IRolee = { id: 456 };
          expectedResult = service.addRoleeToCollectionIfMissing([], rolee, rolee2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rolee);
          expect(expectedResult).toContain(rolee2);
        });

        it('should accept null and undefined values', () => {
          const rolee: IRolee = { id: 123 };
          expectedResult = service.addRoleeToCollectionIfMissing([], null, rolee, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rolee);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

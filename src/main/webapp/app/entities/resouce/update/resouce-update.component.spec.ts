jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ResouceService } from '../service/resouce.service';
import { IResouce, Resouce } from '../resouce.model';
import { IRolee } from 'app/entities/rolee/rolee.model';
import { RoleeService } from 'app/entities/rolee/service/rolee.service';
import { IPermision } from 'app/entities/permision/permision.model';
import { PermisionService } from 'app/entities/permision/service/permision.service';

import { ResouceUpdateComponent } from './resouce-update.component';

describe('Component Tests', () => {
  describe('Resouce Management Update Component', () => {
    let comp: ResouceUpdateComponent;
    let fixture: ComponentFixture<ResouceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let resouceService: ResouceService;
    let roleeService: RoleeService;
    let permisionService: PermisionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ResouceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ResouceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResouceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      resouceService = TestBed.inject(ResouceService);
      roleeService = TestBed.inject(RoleeService);
      permisionService = TestBed.inject(PermisionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Rolee query and add missing value', () => {
        const resouce: IResouce = { id: 456 };
        const rolees: IRolee[] = [{ id: 32678 }];
        resouce.rolees = rolees;

        const roleeCollection: IRolee[] = [{ id: 36563 }];
        spyOn(roleeService, 'query').and.returnValue(of(new HttpResponse({ body: roleeCollection })));
        const additionalRolees = [...rolees];
        const expectedCollection: IRolee[] = [...additionalRolees, ...roleeCollection];
        spyOn(roleeService, 'addRoleeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ resouce });
        comp.ngOnInit();

        expect(roleeService.query).toHaveBeenCalled();
        expect(roleeService.addRoleeToCollectionIfMissing).toHaveBeenCalledWith(roleeCollection, ...additionalRolees);
        expect(comp.roleesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Permision query and add missing value', () => {
        const resouce: IResouce = { id: 456 };
        const permisons: IPermision[] = [{ id: 64695 }];
        resouce.permisons = permisons;

        const permisionCollection: IPermision[] = [{ id: 35894 }];
        spyOn(permisionService, 'query').and.returnValue(of(new HttpResponse({ body: permisionCollection })));
        const additionalPermisions = [...permisons];
        const expectedCollection: IPermision[] = [...additionalPermisions, ...permisionCollection];
        spyOn(permisionService, 'addPermisionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ resouce });
        comp.ngOnInit();

        expect(permisionService.query).toHaveBeenCalled();
        expect(permisionService.addPermisionToCollectionIfMissing).toHaveBeenCalledWith(permisionCollection, ...additionalPermisions);
        expect(comp.permisionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const resouce: IResouce = { id: 456 };
        const rolees: IRolee = { id: 87124 };
        resouce.rolees = [rolees];
        const permisons: IPermision = { id: 69272 };
        resouce.permisons = [permisons];

        activatedRoute.data = of({ resouce });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(resouce));
        expect(comp.roleesSharedCollection).toContain(rolees);
        expect(comp.permisionsSharedCollection).toContain(permisons);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const resouce = { id: 123 };
        spyOn(resouceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ resouce });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: resouce }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(resouceService.update).toHaveBeenCalledWith(resouce);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const resouce = new Resouce();
        spyOn(resouceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ resouce });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: resouce }));
        saveSubject.complete();

        // THEN
        expect(resouceService.create).toHaveBeenCalledWith(resouce);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const resouce = { id: 123 };
        spyOn(resouceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ resouce });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(resouceService.update).toHaveBeenCalledWith(resouce);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRoleeById', () => {
        it('Should return tracked Rolee primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRoleeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPermisionById', () => {
        it('Should return tracked Permision primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPermisionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedRolee', () => {
        it('Should return option if no Rolee is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedRolee(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Rolee for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedRolee(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Rolee is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedRolee(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedPermision', () => {
        it('Should return option if no Permision is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedPermision(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Permision for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedPermision(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Permision is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedPermision(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});

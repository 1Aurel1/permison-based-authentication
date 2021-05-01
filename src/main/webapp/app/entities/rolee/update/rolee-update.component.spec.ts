jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RoleeService } from '../service/rolee.service';
import { IRolee, Rolee } from '../rolee.model';

import { RoleeUpdateComponent } from './rolee-update.component';

describe('Component Tests', () => {
  describe('Rolee Management Update Component', () => {
    let comp: RoleeUpdateComponent;
    let fixture: ComponentFixture<RoleeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let roleeService: RoleeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RoleeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RoleeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      roleeService = TestBed.inject(RoleeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const rolee: IRolee = { id: 456 };

        activatedRoute.data = of({ rolee });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rolee));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const rolee = { id: 123 };
        spyOn(roleeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ rolee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rolee }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(roleeService.update).toHaveBeenCalledWith(rolee);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const rolee = new Rolee();
        spyOn(roleeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ rolee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rolee }));
        saveSubject.complete();

        // THEN
        expect(roleeService.create).toHaveBeenCalledWith(rolee);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const rolee = { id: 123 };
        spyOn(roleeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ rolee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(roleeService.update).toHaveBeenCalledWith(rolee);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PermisionService } from '../service/permision.service';

import { PermisionDeleteDialogComponent } from './permision-delete-dialog.component';

describe('Component Tests', () => {
  describe('Permision Management Delete Component', () => {
    let comp: PermisionDeleteDialogComponent;
    let fixture: ComponentFixture<PermisionDeleteDialogComponent>;
    let service: PermisionService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PermisionDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(PermisionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PermisionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PermisionService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});

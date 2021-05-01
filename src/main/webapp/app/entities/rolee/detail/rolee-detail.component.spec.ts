import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoleeDetailComponent } from './rolee-detail.component';

describe('Component Tests', () => {
  describe('Rolee Management Detail Component', () => {
    let comp: RoleeDetailComponent;
    let fixture: ComponentFixture<RoleeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RoleeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ rolee: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RoleeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RoleeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rolee on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rolee).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PermisionDetailComponent } from './permision-detail.component';

describe('Component Tests', () => {
  describe('Permision Management Detail Component', () => {
    let comp: PermisionDetailComponent;
    let fixture: ComponentFixture<PermisionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PermisionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ permision: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PermisionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PermisionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load permision on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.permision).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

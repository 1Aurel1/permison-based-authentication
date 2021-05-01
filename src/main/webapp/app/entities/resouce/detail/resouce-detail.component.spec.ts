import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ResouceDetailComponent } from './resouce-detail.component';

describe('Component Tests', () => {
  describe('Resouce Management Detail Component', () => {
    let comp: ResouceDetailComponent;
    let fixture: ComponentFixture<ResouceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResouceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ resouce: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ResouceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResouceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load resouce on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resouce).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

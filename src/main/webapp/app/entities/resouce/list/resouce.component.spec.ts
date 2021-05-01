import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ResouceService } from '../service/resouce.service';

import { ResouceComponent } from './resouce.component';

describe('Component Tests', () => {
  describe('Resouce Management Component', () => {
    let comp: ResouceComponent;
    let fixture: ComponentFixture<ResouceComponent>;
    let service: ResouceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ResouceComponent],
      })
        .overrideTemplate(ResouceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResouceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ResouceService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.resouces?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PermisionService } from '../service/permision.service';

import { PermisionComponent } from './permision.component';

describe('Component Tests', () => {
  describe('Permision Management Component', () => {
    let comp: PermisionComponent;
    let fixture: ComponentFixture<PermisionComponent>;
    let service: PermisionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PermisionComponent],
      })
        .overrideTemplate(PermisionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PermisionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PermisionService);

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
      expect(comp.permisions?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

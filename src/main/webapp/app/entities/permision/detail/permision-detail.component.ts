import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPermision } from '../permision.model';

@Component({
  selector: 'jhi-permision-detail',
  templateUrl: './permision-detail.component.html',
})
export class PermisionDetailComponent implements OnInit {
  permision: IPermision | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permision }) => {
      this.permision = permision;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

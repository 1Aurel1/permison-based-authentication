import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResouce } from '../resouce.model';

@Component({
  selector: 'jhi-resouce-detail',
  templateUrl: './resouce-detail.component.html',
})
export class ResouceDetailComponent implements OnInit {
  resouce: IResouce | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resouce }) => {
      this.resouce = resouce;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

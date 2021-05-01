import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRolee } from '../rolee.model';

@Component({
  selector: 'jhi-rolee-detail',
  templateUrl: './rolee-detail.component.html',
})
export class RoleeDetailComponent implements OnInit {
  rolee: IRolee | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rolee }) => {
      this.rolee = rolee;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

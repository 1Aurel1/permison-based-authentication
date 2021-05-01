import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRolee, Rolee } from '../rolee.model';
import { RoleeService } from '../service/rolee.service';

@Component({
  selector: 'jhi-rolee-update',
  templateUrl: './rolee-update.component.html',
})
export class RoleeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(20)]],
    description: [null, [Validators.maxLength(150)]],
  });

  constructor(protected roleeService: RoleeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rolee }) => {
      this.updateForm(rolee);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rolee = this.createFromForm();
    if (rolee.id !== undefined) {
      this.subscribeToSaveResponse(this.roleeService.update(rolee));
    } else {
      this.subscribeToSaveResponse(this.roleeService.create(rolee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRolee>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(rolee: IRolee): void {
    this.editForm.patchValue({
      id: rolee.id,
      name: rolee.name,
      description: rolee.description,
    });
  }

  protected createFromForm(): IRolee {
    return {
      ...new Rolee(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}

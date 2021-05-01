import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPermision, Permision } from '../permision.model';
import { PermisionService } from '../service/permision.service';

@Component({
  selector: 'jhi-permision-update',
  templateUrl: './permision-update.component.html',
})
export class PermisionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(20)]],
    description: [null, [Validators.maxLength(150)]],
  });

  constructor(protected permisionService: PermisionService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permision }) => {
      this.updateForm(permision);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const permision = this.createFromForm();
    if (permision.id !== undefined) {
      this.subscribeToSaveResponse(this.permisionService.update(permision));
    } else {
      this.subscribeToSaveResponse(this.permisionService.create(permision));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPermision>>): void {
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

  protected updateForm(permision: IPermision): void {
    this.editForm.patchValue({
      id: permision.id,
      name: permision.name,
      description: permision.description,
    });
  }

  protected createFromForm(): IPermision {
    return {
      ...new Permision(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}

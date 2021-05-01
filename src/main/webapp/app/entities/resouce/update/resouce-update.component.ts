import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IResouce, Resouce } from '../resouce.model';
import { ResouceService } from '../service/resouce.service';
import { IRolee } from 'app/entities/rolee/rolee.model';
import { RoleeService } from 'app/entities/rolee/service/rolee.service';
import { IPermision } from 'app/entities/permision/permision.model';
import { PermisionService } from 'app/entities/permision/service/permision.service';

@Component({
  selector: 'jhi-resouce-update',
  templateUrl: './resouce-update.component.html',
})
export class ResouceUpdateComponent implements OnInit {
  isSaving = false;

  roleesSharedCollection: IRolee[] = [];
  permisionsSharedCollection: IPermision[] = [];

  editForm = this.fb.group({
    id: [],
    address: [null, [Validators.required, Validators.maxLength(200)]],
    method: [null, [Validators.required, Validators.maxLength(30)]],
    description: [null, [Validators.maxLength(200)]],
    rolees: [],
    permisons: [],
  });

  constructor(
    protected resouceService: ResouceService,
    protected roleeService: RoleeService,
    protected permisionService: PermisionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resouce }) => {
      this.updateForm(resouce);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resouce = this.createFromForm();
    if (resouce.id !== undefined) {
      this.subscribeToSaveResponse(this.resouceService.update(resouce));
    } else {
      this.subscribeToSaveResponse(this.resouceService.create(resouce));
    }
  }

  trackRoleeById(index: number, item: IRolee): number {
    return item.id!;
  }

  trackPermisionById(index: number, item: IPermision): number {
    return item.id!;
  }

  getSelectedRolee(option: IRolee, selectedVals?: IRolee[]): IRolee {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedPermision(option: IPermision, selectedVals?: IPermision[]): IPermision {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResouce>>): void {
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

  protected updateForm(resouce: IResouce): void {
    this.editForm.patchValue({
      id: resouce.id,
      address: resouce.address,
      method: resouce.method,
      description: resouce.description,
      rolees: resouce.rolees,
      permisons: resouce.permisons,
    });

    this.roleesSharedCollection = this.roleeService.addRoleeToCollectionIfMissing(this.roleesSharedCollection, ...(resouce.rolees ?? []));
    this.permisionsSharedCollection = this.permisionService.addPermisionToCollectionIfMissing(
      this.permisionsSharedCollection,
      ...(resouce.permisons ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.roleeService
      .query()
      .pipe(map((res: HttpResponse<IRolee[]>) => res.body ?? []))
      .pipe(
        map((rolees: IRolee[]) => this.roleeService.addRoleeToCollectionIfMissing(rolees, ...(this.editForm.get('rolees')!.value ?? [])))
      )
      .subscribe((rolees: IRolee[]) => (this.roleesSharedCollection = rolees));

    this.permisionService
      .query()
      .pipe(map((res: HttpResponse<IPermision[]>) => res.body ?? []))
      .pipe(
        map((permisions: IPermision[]) =>
          this.permisionService.addPermisionToCollectionIfMissing(permisions, ...(this.editForm.get('permisons')!.value ?? []))
        )
      )
      .subscribe((permisions: IPermision[]) => (this.permisionsSharedCollection = permisions));
  }

  protected createFromForm(): IResouce {
    return {
      ...new Resouce(),
      id: this.editForm.get(['id'])!.value,
      address: this.editForm.get(['address'])!.value,
      method: this.editForm.get(['method'])!.value,
      description: this.editForm.get(['description'])!.value,
      rolees: this.editForm.get(['rolees'])!.value,
      permisons: this.editForm.get(['permisons'])!.value,
    };
  }
}

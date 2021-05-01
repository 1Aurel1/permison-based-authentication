import { IRolee } from 'app/entities/rolee/rolee.model';
import { IPermision } from 'app/entities/permision/permision.model';

export interface IResouce {
  id?: number;
  address?: string;
  method?: string;
  description?: string | null;
  rolees?: IRolee[] | null;
  permisons?: IPermision[] | null;
}

export class Resouce implements IResouce {
  constructor(
    public id?: number,
    public address?: string,
    public method?: string,
    public description?: string | null,
    public rolees?: IRolee[] | null,
    public permisons?: IPermision[] | null
  ) {}
}

export function getResouceIdentifier(resouce: IResouce): number | undefined {
  return resouce.id;
}

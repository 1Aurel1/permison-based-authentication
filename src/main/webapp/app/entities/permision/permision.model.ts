import { IResouce } from 'app/entities/resouce/resouce.model';

export interface IPermision {
  id?: number;
  name?: string;
  description?: string | null;
  resouces?: IResouce[] | null;
}

export class Permision implements IPermision {
  constructor(public id?: number, public name?: string, public description?: string | null, public resouces?: IResouce[] | null) {}
}

export function getPermisionIdentifier(permision: IPermision): number | undefined {
  return permision.id;
}

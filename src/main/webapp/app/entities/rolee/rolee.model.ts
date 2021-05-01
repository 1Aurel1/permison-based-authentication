import { IResouce } from 'app/entities/resouce/resouce.model';

export interface IRolee {
  id?: number;
  name?: string;
  description?: string | null;
  resouces?: IResouce[] | null;
}

export class Rolee implements IRolee {
  constructor(public id?: number, public name?: string, public description?: string | null, public resouces?: IResouce[] | null) {}
}

export function getRoleeIdentifier(rolee: IRolee): number | undefined {
  return rolee.id;
}

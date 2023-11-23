import { isPlainObject } from '../../utils/object.util';

export type IGetDefaults = {
  getDefaults: () => any;
};

export function implementsGetDefaults(model: any): model is IGetDefaults {
  return typeof (model as IGetDefaults).getDefaults === 'function';
}

export type IAfterInit = {
  afterInit: () => any;
};

export function implementsAfterInit(model: any): model is IAfterInit {
  return isPlainObject(model) && typeof (model as IAfterInit).afterInit === 'function';
}

export type IToJson = {
  toJSON: () => any;
};

export function implementsToJson(model: any): model is IToJson {
  return typeof (model as IToJson).toJSON === 'function';
}

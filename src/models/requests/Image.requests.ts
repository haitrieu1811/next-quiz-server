import { ParamsDictionary } from 'express-serve-static-core';

// Params: Id của ánh
export interface imageIdReqParams extends ParamsDictionary {
  image_id: string;
}

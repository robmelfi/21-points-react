import { Moment } from 'moment';

export interface IWeigth {
  id?: number;
  timestamp?: Moment;
  weight?: number;
  userLogin?: string;
  userId?: number;
}

export const defaultValue: Readonly<IWeigth> = {};

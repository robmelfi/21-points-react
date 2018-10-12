import { Moment } from 'moment';

export interface IPoints {
  id?: number;
  date?: Moment;
  excercise?: number;
  meals?: number;
  alcohol?: number;
  notes?: string;
  userLogin?: string;
  userId?: number;
}

export const defaultValue: Readonly<IPoints> = {};

import { Moment } from 'moment';

export interface IBloodPressure {
  id?: number;
  timestamp?: Moment;
  systolic?: number;
  diastolic?: number;
  userLogin?: string;
  userId?: number;
}

export const defaultValue: Readonly<IBloodPressure> = {};

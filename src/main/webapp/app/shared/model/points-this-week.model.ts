import { Moment } from 'moment';

export interface IPointsThisWeek {
  week?: Moment;
  points?: number;
}

export const defaultValue: Readonly<IPointsThisWeek> = {};

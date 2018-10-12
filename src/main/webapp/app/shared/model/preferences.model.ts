export const enum Units {
  KG = 'KG',
  LB = 'LB'
}

export interface IPreferences {
  id?: number;
  weeklyGoal?: number;
  weightUnits?: Units;
  userLogin?: string;
  userId?: number;
}

export const defaultValue: Readonly<IPreferences> = {};

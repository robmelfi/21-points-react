
export interface IBloodPressureChart {
  title?: string;
  yAxis?: {
    label?: string
  };
  data: {timestamp: string, d: number, s: number}[];
  interval?: number;
}

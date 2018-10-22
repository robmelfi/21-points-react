
export interface IBloodPressureChart {
  title?: string;
  yAxis?: {
    label?: string
  };
  data?: Array<{ timestamp: string, d: number, s: number }>;
  interval?: number;
}

export const defaultValue = {
  title: '',
  yAxis: {
    label: ''
  },
  data: [],
  interval: 0
};

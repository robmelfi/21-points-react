
export interface IWeigthChart {
  title?: string;
  yAxis?: {
    label?: string
  };
  data?: Array<{ timestamp: string, w: number }>;
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

export interface PointDTO {
  name: string;
  value: number;
}

export interface ChartSeriesDTO {
  name: string;
  series: PointDTO[];
}
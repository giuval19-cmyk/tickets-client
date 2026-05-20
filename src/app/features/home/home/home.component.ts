import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { StatsService } from '../../../core/services/stats.service';
import { ChartSeriesDTO } from '../../../core/models/chart';
import { TranslateModule } from '@ngx-translate/core';
import { ChartOptions } from 'chart.js';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgChartsModule,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  sitChartType: 'bar' = 'bar';

  sitChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  trendChartType: 'line' = 'line';

  trendChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  private priorityColors: Record<string, { background: string; border: string }> = {
    HIGH: {
      background: '#ffebee',
      border: '#c62828'
    },
    MEDIUM: {
      background: '#fff8e1',
      border: '#ef6c00'
    },
    LOW: {
      background: '#e8f5e9',
      border: '#2e7d32'
    }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  };


  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.statsService.getChartData()
      .subscribe((data: ChartSeriesDTO[]) => {
        this.sitChartData = this.buildBarChart(data);
      });

    this.statsService.getChartTrends()
      .subscribe((data: ChartSeriesDTO[]) => {
        this.trendChartData = this.buildLineChart(data);
      });
  }

  private buildBaseChart(data: ChartSeriesDTO[]) {
    //mette in un array tutti i nomi della serie
    const labels = Array.from(
      new Set(
        data.flatMap(series => series.series.map(p => p.name))
      )
    );

    const datasets = data.map(series => {

      const values = labels.map(label => {
        const point = series.series.find(p => p.name === label);
        return point ? point.value : 0;
      });

      const colors = this.priorityColors[series.name] || {
        background: '#e0e0e0',
        border: '#9e9e9e'
      };

      return {
        label: series.name,
        data: values,
        colors
      };
    });

    return { labels, datasets };
  }

  private buildBarChart(data: ChartSeriesDTO[]): ChartData<'bar'> {
    const base = this.buildBaseChart(data);

    return {
      labels: base.labels,
      datasets: base.datasets.map(d => ({
        label: d.label,
        data: d.data,
        backgroundColor: d.colors.background,
        borderColor: d.colors.border,
        borderWidth: 2
      }))
    };
  }

  private buildLineChart(data: ChartSeriesDTO[]): ChartData<'line'> {
    const base = this.buildBaseChart(data);

    return {
      labels: base.labels,
      datasets: base.datasets.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.colors.border,
        backgroundColor: d.colors.background,
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }))
    };
  }

}
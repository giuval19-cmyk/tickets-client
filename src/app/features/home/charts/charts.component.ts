import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { StatsService } from '../../../core/services/stats.service';
import { ChartSeriesDTO } from '../../../core/models/chart';
import { TranslateModule } from '@ngx-translate/core';
import { ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-charts',
  imports: [
    CommonModule,
    NgChartsModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  loading = true;
  error = false;

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
    URGENT: {
      background: '#ffebee',
      border: '#830404'
    },
    HIGH: {
      background: '#ffebee',
      border: '#993f3f'
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

    forkJoin({
      sitChart: this.statsService.getChartData(),
      trendChart: this.statsService.getChartTrends()
    }).subscribe({
      next: ({ sitChart, trendChart }) => {
        this.sitChartData = this.buildBarChart(sitChart);
        this.trendChartData = this.buildLineChart(trendChart);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  private buildBaseChart(data: ChartSeriesDTO[], serieColors?: Record<string, { background: string; border: string }>) {
    //mette in un array tutti i nomi della serie
    const labels = Array.from(
      new Set(
        data.flatMap(series => series.series.map(p => p.name))
      )
    );

    const colorPalette = this.generateColors(data.length);

    const datasets = data.map((series, index) => {

      const values = labels.map(label => {
        const point = series.series.find(p => p.name === label);
        return point ? point.value : 0;
      });


      const colors = serieColors
        ? (serieColors[series.name] ?? {
          background: '#e0e0e0',
          border: '#9e9e9e'
        })
        : colorPalette[index];


      return {
        label: series.name,
        data: values,
        colors
      };
    });

    return { labels, datasets };
  }

  private buildBarChart(data: ChartSeriesDTO[]): ChartData<'bar'> {
    const base = this.buildBaseChart(data, this.priorityColors);

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

  private generateColors(count: number) {
    const colors = [];

    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;

      colors.push({
        border: `hsl(${hue}, 70%, 40%)`,
        background: `hsla(${hue}, 70%, 50%, 0.3)`
      });
    }

    return colors;
  }

}

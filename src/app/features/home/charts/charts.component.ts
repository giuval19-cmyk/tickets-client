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
import { TicketService } from '../../../core/services/ticket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    TranslateModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  loading = true;
  error = false;
  private appColorMap: Record<string, { background: string; border: string }> = {};

  openChartType: 'bar' = 'bar';
  openChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  closeChartType: 'line' = 'line';
  closeChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
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

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  selectedDays: number = 30;

  constructor(private statsService: StatsService, private ticketService: TicketService) { }

  ngOnInit() {

    this.ticketService.getApps().subscribe({
      next: (apps) => {
        this.generateAppColors(apps);

        this.loadChartsData(this.selectedDays);
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  private generateAppColors(apps: string[]) {

    if (!apps?.length) return;

    const palette = this.generateColors(apps.length);

    apps.forEach((app, index) => {
      this.appColorMap[app] = palette[index];
    });
  }

  loadChartsData(days: number) {
    this.loading = true;
    this.error = false;


    forkJoin({
      openChart: this.statsService.getOpenTrends(days),
      closeChart: this.statsService.getCloseTrends(days)
    }).subscribe({
      next: ({ openChart, closeChart }) => {
        this.openChartData = this.buildBarChart(openChart, this.appColorMap);
        this.closeChartData = this.buildLineChart(closeChart, this.appColorMap);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  /**
   * Chiamato dall'interfaccia HTML quando l'utente cambia la selezione dei giorni
   */
  onDaysChange() {
    this.loadChartsData(this.selectedDays);
  }

  private buildBaseChart(
    data: ChartSeriesDTO[],
    colorMap: Record<string, { background: string; border: string }>
  ) {
    //mette in un array tutti i nomi della serie
    const labels = Array.from(
      new Set(
        data.flatMap(series => series.series.map(p => p.name))
      )
    );

    const datasets = data.map((series, index) => {

      const values = labels.map(label => {
        const point = series.series.find(p => p.name === label);
        return point ? point.value : 0;
      });

      const colors = colorMap[series.name] ?? {
        background: '#eceff1',
        border: '#90a4ae'
      };


      return {
        label: series.name,
        data: values,
        colors
      };
    });

    return { labels, datasets };
  }

  private buildBarChart(
    data: ChartSeriesDTO[],
    colorMap: Record<string, { background: string; border: string }>
  ): ChartData<'bar'> {
    const base = this.buildBaseChart(data, colorMap);

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

  private buildLineChart(
    data: ChartSeriesDTO[],
    colorMap: Record<string, { background: string; border: string }>
  ): ChartData<'line'> {
    const base = this.buildBaseChart(data, colorMap);

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

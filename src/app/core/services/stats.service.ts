import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartSeriesDTO } from '../../core/models/chart';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private baseUrl = `${environment.api.dss}`;

  constructor(private http: HttpClient) { }

  getChartData(): Observable<ChartSeriesDTO[]> {
    return this.http.get<ChartSeriesDTO[]>(
      `${this.baseUrl}/analytics/ticket-sits`
    );
  }

  getChartTrends(): Observable<ChartSeriesDTO[]> {
    return this.http.get<ChartSeriesDTO[]>(
      `${this.baseUrl}/analytics/ticket-trends`
    );
  }

}

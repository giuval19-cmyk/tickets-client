import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChartSeriesDTO } from '../../core/models/chart';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private baseUrl = `${environment.api.dss}`;

  constructor(private http: HttpClient) { }

  getOpenTrends(days: number): Observable<ChartSeriesDTO[]> {
    // Usiamo HttpParams per passare i query parameters in modo pulito
    const params = new HttpParams().set('days', days.toString());

    return this.http.get<ChartSeriesDTO[]>(
      `${this.baseUrl}/analytics/open-trends`,
      { params }
    );
  }

  getCloseTrends(days: number): Observable<ChartSeriesDTO[]> {
    // Aggiunto il parametro anche qui, altrimenti il server non sa quanti giorni analizzare!
    const params = new HttpParams().set('days', days.toString());

    return this.http.get<ChartSeriesDTO[]>(
      `${this.baseUrl}/analytics/close-trends`,
      { params }
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { SuggestDTO, Ticket, TicketPriority } from '../models/ticket.model';
import { TicketCountDTO } from '../models/ticket-count';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = `${environment.api.support}`;

  constructor(private http: HttpClient) { }

  getTickets(params?: any) {
    return this.http.get<Ticket[]>(`${this.baseUrl}/inq/tickets`, { params });
  }


  getTicketById(id: string) {
    return this.http.get<Ticket>(
      `${this.baseUrl}/inq/tickets/${id}`
    );
  }

  takeInCharge(id: string) {
    return this.http.patch<Ticket>(`${this.baseUrl}/support/${id}/take`, {});
  }

  closeTicket(id: string, notes: string[]) {
    return this.http.patch<Ticket>(`${this.baseUrl}/support/${id}/close`, {
      notes
    });
  }

  getStatuses() {
    return this.http.get<string[]>(
      `${this.baseUrl}/support/ticket-statuses`
    );
  }

  getPriorities() {
    return this.http.get<TicketPriority[]>(
      `${this.baseUrl}/support/ticket-priorities`
    );
  }

  getApps() {
    return this.http.get<string[]>(
      `${this.baseUrl}/support/apps`
    );
  }

  getDashboard() {
    return this.http.get<TicketCountDTO[]>(
      `${this.baseUrl}/inq/dashboard`
    );
  }

  changePriority(id: string, priority: TicketPriority) {
    return this.http.patch<Ticket>(`${this.baseUrl}/support/${id}/priority`, {
      priority
    });
  }

  getTicketSuggestion(ticketId: string): Observable<SuggestDTO> {
  
    const currentLang = localStorage.getItem('lang') || 'it';
    const params = new HttpParams().set('lang', currentLang);
    return this.http.get<SuggestDTO>(`${this.baseUrl}/inq/${ticketId}/suggest`, { params });
  }

}
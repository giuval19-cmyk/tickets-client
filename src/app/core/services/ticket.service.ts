import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Ticket } from '../models/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = `${environment.api.support}`;

  constructor(private http: HttpClient) { }

  getTickets(params?: any) {
    console.log('Ricerca per params')
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

  closeTicket(id: string, resolution: string) {
    return this.http.patch<Ticket>(`${this.baseUrl}/support/${id}/close`, {
      resolution
    });
  }

  getStatuses() {
    return this.http.get<string[]>(
      `${this.baseUrl}/support/ticket-statuses`
    );
  }

  getPriorities() {
    return this.http.get<string[]>(
      `${this.baseUrl}/support/ticket-priorities`
    );
  }

  getApps() {
    return this.http.get<string[]>(
      `${this.baseUrl}/support/apps`
    );
  }

}
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = `${environment.api.dss}`;
  private eventSource?: EventSourcePolyfill;

  constructor(private auth: AuthService) { }

  connect(onMessage: (data: any) => void) {

    if (this.eventSource) {
      return; //evita doppie connessioni
    }

    this.eventSource = new EventSourcePolyfill(`${this.baseUrl}/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`
      },
      heartbeatTimeout: 45000
    });

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.warn('Evento SSE non valido:', event.data);
      }
    };

    this.eventSource.onerror = () => {

      console.warn('Connessione SSE persa, riconnessione...');

      this.disconnect();

      // retry dopo 60 secondi
      setTimeout(() => {
        this.connect(onMessage);
      }, 60 * 1000);
    };

  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = undefined;
  }
}
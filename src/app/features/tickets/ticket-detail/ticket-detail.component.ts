import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TicketPriority } from '../../../core/models/ticket.model';
import { MatSnackBar } from '@angular/material/snack-bar';


import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TicketSuggestComponent } from '../ticket-suggest/ticket-suggest.component';
import { SuggestDTO } from '../../../core/models/ticket.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    TicketSuggestComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ticket: Ticket | null = null;
  showResolution = false;
  resolution = '';
  isAdmin = false;
  priorities: TicketPriority[] = [];
  suggestion: SuggestDTO | null = null;
  private routeSub?: Subscription;

  @ViewChild('resolutionCtrl') resolutionCtrl!: NgModel;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.isAdmin = this.auth.hasRole('ADMIN');

    this.routeSub = this.route.paramMap.subscribe(paramMap => {
      const ticketId = paramMap.get('id');

      if (ticketId) {
        this.loadTicketDetails(ticketId);
      }
    });

  }

  ngOnDestroy() {
    // Buona norma: cancella la sottoscrizione per evitare Memory Leak
    this.routeSub?.unsubscribe();
  }

  loadTicketDetails(id: string) {

    this.ticketService.getTicketById(id!)
      .subscribe({
        next: res => {
          this.ticket = res;
          this.showResolution = res.status === 'IN_PROGRESS'

          if (res.status === 'IN_PROGRESS') {
            this.loadSuggestion(res.id);
          }
        },
        error: err => {
          console.error('ERROR TICKETS:', err);

          this.showToast('Si è verificato un errore');
        }
      });

  }

  takeInCharge() {

    if (!this.ticket) return;

    this.ticketService.takeInCharge(this.ticket.id)
      .subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.showResolution = true;
          this.loadSuggestion(updatedTicket.id);
        },
        error: err => {
          console.error('ERROR takeInCharge:', err);

          const message =
            err.error?.message ||
            err.message ||
            'Error';

          this.showToast(message, 'error');
        }
      });
  }

  closeTicket() {

    if (!this.resolution || this.resolution.trim() === '') {
      this.resolutionCtrl.control.markAsTouched();
      this.resolutionCtrl.control.updateValueAndValidity();
      return;
    }

    //PARSING DELLA TEXTAREA IN LISTA DI STRINGHE
    const stepsArray: string[] = this.resolution
      .split('\n')                        // Spezza la stringa ad ogni "andata a capo"
      .map(line => line.trim())           // Rimuove spazi vuoti all'inizio e alla fine di ogni riga
      .map(line => line.replace(/^-\s*/, '')) // Rimuove il trattino iniziale "- " (se presente) usando una Regex
      .filter(line => line.length > 0);   // Scarta le righe vuote (es. doppi invii accidentali)

    console.log(stepsArray);
    this.ticketService.closeTicket(this.ticket!.id, stepsArray)
      .subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.showResolution = false;

          this.suggestion = null;
        },
        error: err => {
          console.error('ERROR takeInCharge:', err);

          const message =
            err.error?.message ||
            err.message ||
            'Error';
          this.showToast(message, 'error');

        }
      });
  }

  updatePriority(newPriority: TicketPriority) {
    if (!this.ticket) return;

    this.ticketService.changePriority(this.ticket.id, newPriority)
      .subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;

          const message = this.translate.instant('ticket.priorityChanged');

          this.showToast(message, 'success');
        },
        error: err => {
          console.error('ERROR updatePriority:', err);

          const message =
            err.error?.message ||
            err.message ||
            'Error';

          this.showToast(message, 'error');
        }
      });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success'
        ? ['snackbar-success']
        : ['snackbar-error']
    });
  }

  loadSuggestion(ticketId: string) {
    this.ticketService.getTicketSuggestion(ticketId)
      .subscribe({
        next: res => this.suggestion = res,
        error: err => {
          const message =
            err.error?.message ||
            err.message ||
            'Error';

          this.showToast(message, 'error');
        }
      });
  }

  handleApplySuggestion(steps: string[]) {
    const formattedSteps = steps.map(step => `- ${step}`).join('\n');
    this.resolution = `${formattedSteps}`;
  }

}
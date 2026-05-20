import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';
import { MatSnackBar } from '@angular/material/snack-bar';


import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent {


  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) { }

  ticket: Ticket | null = null;
  showResolution = false;
  resolution = '';

  @ViewChild('resolutionCtrl') resolutionCtrl!: NgModel;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.ticketService.getTicketById(id!)
      .subscribe({
        next: res => {
          this.ticket = res;
          this.showResolution = res.status === 'IN_PROGRESS'
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

    this.ticketService.closeTicket(this.ticket!.id, this.resolution)
      .subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.showResolution = false;
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

}
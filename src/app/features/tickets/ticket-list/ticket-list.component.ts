import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../../core/models/ticket.model';
import { TranslateModule } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent {

  @Input() tickets: Ticket[] = [];

  constructor(public route: ActivatedRoute) {}

  getStatusIcon(status: string): string {
    switch (status) {
      case 'OPEN': return 'fiber_new';
      case 'IN_PROGRESS': return 'autorenew';
      case 'PENDING_CUSTOMER': return 'schedule';
      case 'RESOLVED': return 'check_circle';
      case 'CLOSED': return 'task_alt';
      default: return 'help_outline';
    }
  }

}

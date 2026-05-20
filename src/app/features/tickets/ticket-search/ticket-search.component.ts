import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    TicketListComponent,
    TranslateModule
  ],
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.scss']
})
export class TicketSearchComponent {

  private debounceTimer: any;

  status: string = '';
  keyword: string = '';
  priority: string = '';
  sourceApp: string = '';

  statuses: string[] = [];
  priorities: string[] = [];
  apps: string[] = [];

  results: Ticket[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService) { }

  ngOnInit() {

    this.ticketService.getStatuses()
      .subscribe({
        next: res => {
          this.statuses = res;
        },
        error: err => {
          console.error('ERROR:', err);
        }
      });

    this.ticketService.getPriorities()
      .subscribe({
        next: res => {
          this.priorities = res;
        },
        error: err => {
          console.error('ERR PRIORITIES', err)
        }
      });

    this.ticketService.getApps()
      .subscribe({
        next: res => {
          this.apps = res;
        },
        error: err => {
          console.error('ERR PRIORITIES', err)
        }
      });

    this.route.queryParamMap.subscribe(params => {

      this.keyword = params.get('keyword') || '';
      this.sourceApp = params.get('sourceApp') || '';
      this.priority = params.get('priority') || '';
      this.status = params.get('status') || '';

      this.searchInternal();
    });
  }


  searchInternal() {

    const filters = {
      keyword: this.keyword,
      sourceApp: this.sourceApp,
      priority: this.priority,
      status: this.status
    };

    this.ticketService.getTickets(filters)
      .subscribe({
        next: res => {
          this.results = res;
        },
        error: err => {
          console.error('ERROR TICKETS:', err);
        }
      });
  }

  onFilterChange() {

    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

      this.router.navigate(['/tickets'], {
        queryParams: {
          status: this.status || null,
          keyword: this.keyword || null,
          priority: this.priority || null,
          sourceApp: this.sourceApp || null
        }
      });
    }, 400);
  }

  resetFilters() {
    this.status = '';
    this.keyword = '';
    this.priority = '';
    this.sourceApp = '';

    this.router.navigate(['/tickets'], {
      queryParams: {
        status: null,
        keyword: null,
        priority: null,
        sourceApp: null
      }
    });
  }
}
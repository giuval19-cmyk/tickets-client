import { Component, OnInit } from '@angular/core';
import { TicketCountDTO } from '../../../core/models/ticket-count';
import { TicketService } from '../../../core/services/ticket.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  apps: string[] = [];
  statuses: string[] = [];
  tableData: any[] = [];
  displayedColumns: string[] = [];

  loading = true;
  error = false;

  constructor(private ticketService: TicketService, private router: Router) { }

  ngOnInit() {

    forkJoin({
      apps: this.ticketService.getApps(),
      statuses: this.ticketService.getStatuses(),
      data: this.ticketService.getDashboard()
    }).subscribe({
      next: ({ apps, statuses, data }) => {
        this.apps = apps;
        this.statuses = statuses;

        this.tableData = this.buildTable(apps, statuses, data);
        this.displayedColumns = ['app', ...statuses];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });


  }

  private buildTable(
    apps: string[],
    statuses: string[],
    data: TicketCountDTO[]
  ) {

    return apps.map(app => {

      const row: any = { app };

      statuses.forEach(status => {

        const match = data.find(
          d => d.app === app && d.status === status
        );

        row[status] = match ? match.count : 0;
      });

      return row;
    });
  }

  goToTickets(app: string, status: string) {
    this.router.navigate(['/tickets'], {
      queryParams: {
        sourceApp: app,
        status: status
      }
    });
  }


}

import { Component } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DashboardComponent,
    ChartsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {



}
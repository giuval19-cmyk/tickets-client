import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { TicketListComponent } from './features/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { TicketSearchComponent } from './features/tickets/ticket-search/ticket-search.component';
import { HomeComponent } from './features/home/home/home.component';

import { authGuard } from './core/auth.guard';
import { redirectGuard } from './core/redirect.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'ticket/:id', component: TicketDetailComponent, canActivate: [authGuard] },
  { path: 'tickets', component: TicketSearchComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
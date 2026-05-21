import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './core/services/notification.service';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatMenuModule, MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    TranslateModule,
    RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'tickets-client';
  notificationsCount = 0;
  notifications: any[] = [];

  isAdmin = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private notifyService: NotificationService) {

    const savedLang = localStorage.getItem('lang') || 'it';

    this.translate.use(savedLang);
  }

  ngOnInit() {
    this.isAdmin = this.auth.hasRole('ADMIN');

    this.notifyService.connect((event) => {
      this.notificationsCount = this.notificationsCount + 1;

      this.notifications.unshift(event); //aggiungi in cima

      //mantieni max 20 notifiche
      if (this.notifications.length > 20) {
        this.notifications.pop();
      }

    });
  }

  get isLoggedIn() {
    return this.auth.isLogged();
  }

  logout() {
    this.auth.logout();
    this.notifyService.disconnect();
    this.router.navigate(['/login']);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  openNotifications() {
    this.notificationsCount = 0;
  }

  ngOnDestroy() {
    this.notifyService.disconnect();
  }

}

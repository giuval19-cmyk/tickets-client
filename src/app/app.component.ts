import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatMenuModule, MatToolbarModule,
    MatIconModule,
    TranslateModule,
    RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tickets-client';

  isAdmin = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService) {

    const savedLang = localStorage.getItem('lang') || 'it';

    this.translate.use(savedLang);
  }

  ngOnInit() {
    this.isAdmin = this.auth.hasRole('ADMIN');
  }

  get isLoggedIn() {
    return this.auth.isLogged();
  }

  logout() {
    this.auth.logout();

    this.router.navigate(['/login']);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  get currentLang() {
    return this.translate.currentLang;
  }
}

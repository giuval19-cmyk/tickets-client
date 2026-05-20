import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  login(form: any) {
    // forza validation visuale
    form.control.markAllAsTouched();

    if (form.invalid) return;

    this.auth.login(this.email, this.password)
      .subscribe({
        next: () => {
          console.log('Token salvato:', this.auth.getToken());
          console.log('Decoded:', this.auth.decodeToken());

          this.router.navigate(['/']);
        },
        error: err => {
          if (err.status === 401) {
            this.errorMessage = 'login.badCredentials';
          } else {
            this.errorMessage = 'login.error';
          }
        }
      });
  }

}
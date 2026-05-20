import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth.interceptor';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgChartsModule } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'it'
      })
    ),

    provideTranslateHttpLoader({
      prefix: '/i18n/',
      suffix: '.json'
    }),

    importProvidersFrom(NgChartsModule)
  ]
};
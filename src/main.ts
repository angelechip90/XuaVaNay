import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { NotificationService } from './app/core/services/notification.service';
import { StorageService } from './app/core/services/storage.service';
import { ApiService } from './app/core/services/api.service';
import { AuthService } from './app/core/services/auth.service';
import { LoadingService } from './app/core/services/loading.service';
import { NavigationService } from './app/core/services/navigation.service';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { MarkdownModule } from 'ngx-markdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader,provideTranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG  } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideAnimations(),
     provideTranslateHttpLoader(),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: '/assets/i18n/',
        suffix: '.json'
      }
    },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    NotificationService,
    StorageService,
    ApiService,
    AuthService,
    LoadingService,
    NavigationService,
    importProvidersFrom(IonicStorageModule.forRoot()),
    importProvidersFrom(MarkdownModule.forRoot()),
    importProvidersFrom(
      IonicStorageModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'vi',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
});

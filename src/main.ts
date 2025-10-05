import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from './app/core/services/notification.service';
import { StorageService } from './app/core/services/storage.service';
import { ApiService } from './app/core/services/api.service';
import { AuthService } from './app/core/services/auth.service';
import { LoadingService } from './app/core/services/loading.service';
import { NavigationService } from './app/core/services/navigation.service';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    NotificationService,
    StorageService,
    ApiService,
    AuthService,
    LoadingService,
    NavigationService,
    importProvidersFrom(IonicStorageModule.forRoot()),
  ],
});

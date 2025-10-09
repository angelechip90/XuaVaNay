import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../core/services/authguard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
          import('../features/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../features/thenandnow/thenandnow-module').then(
            (m) => m.ThenandnowModule
          ),
      },
      {
        path: 'tab3',
        loadChildren: () =>
          import('../features/geography/geography.module').then(
            (m) => m.GeographyModule
          ),
      },
      {
        path: 'tab4',
        loadChildren: () =>
          import('../features/ebooks/ebooks.module').then(
            (m) => m.EbooksModule
          ),
      },
      {
        canActivate: [AuthGuard],
        path: 'tab5',
        loadChildren: () =>
          import('../features/account/account.module').then(
            (m) => m.AccountModule
          ),
      },
      {
        path: 'demo',
        loadChildren: () =>
          import('../features/demo/demo.module').then((m) => m.DemoModule),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

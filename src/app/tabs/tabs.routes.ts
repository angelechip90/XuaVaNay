import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../features/ai-search/ai-search.module').then(m => m.AiSearchModule),
      },
      {
        path: 'tab2',
        loadChildren: () => import('../features/history/history.module').then(m => m.HistoryModule),
      },
      {
        path: 'tab3',
        loadChildren: () => import('../features/geography/geography.module').then(m => m.GeographyModule),
      },
      {
        path: 'tab4',
        loadChildren: () => import('../features/ebooks/ebooks.module').then(m => m.EbooksModule),
      },
      {
        path: 'tab5',
        loadChildren: () => import('../features/account/account.module').then(m => m.AccountModule),
      },
      {
        path: 'demo',
        loadChildren: () => import('../features/demo/demo.module').then(m => m.DemoModule),
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

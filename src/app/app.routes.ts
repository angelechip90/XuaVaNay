import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'upgrade',
    loadComponent: () => import('./features/account/pages/upgrade/upgrade.page').then( m => m.UpgradePage)
  },
  {
    path: 'purchase-history',
    loadComponent: () => import('./features/account/pages/purchase-history/purchase-history.page').then( m => m.PurchaseHistoryPage)
  },
];

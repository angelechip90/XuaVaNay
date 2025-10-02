import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'upgrade',
    loadComponent: () => import('./features/account/pages/upgrade/upgrade.page').then(m => m.UpgradePage)
  },
  {
    path: 'purchase-history',
    loadComponent: () => import('./features/account/pages/purchase-history/purchase-history.page').then(m => m.PurchaseHistoryPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'thenandnow',
    loadComponent: () => import('./features/thenandnow/pages/index/index.page').then(m => m.IndexPage)
  },
  {
    path: 'index',
    loadComponent: () => import('./features/thenandnow/pages/index/index.page').then(m => m.IndexPage)
  },
  {
    path: 'geography',
    loadComponent: () => import('./features/geography/pages/geography/geography.page').then(m => m.GeographyPage)
  },
  {
    path: 'ebooks',
    loadComponent: () => import('./features/ebooks/pages/ebooks/ebooks.page').then(m => m.EbooksPage)
  },
  {
    path: 'book-detail/:id',
    loadComponent: () => import('./shared/components/book-detail/book-detail.component').then(m => m.BookDetailComponent)
  },
  {
    path: 'book-content/:id',
    loadComponent: () => import('./shared/components/book-content/book-content.component').then(m => m.BookContentComponent)
  }
];

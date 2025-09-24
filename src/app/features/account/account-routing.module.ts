import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPage } from './pages/account/account.page';
import { UpgradePage } from './pages/upgrade/upgrade.page';
import { PurchaseHistoryPage } from './pages/purchase-history/purchase-history.page';
import { HistoryListComponent } from '../history/components/history-list/history-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
  },
  {
    path: 'upgrade',
    component: UpgradePage
  }, {
    path: 'purchase-history',
    component: PurchaseHistoryPage
  },
  {
    path: 'readed-books',
    component: HistoryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }

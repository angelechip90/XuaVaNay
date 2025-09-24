import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryPage } from './pages/history/history.page';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        HistoryRoutingModule,
        HistoryPage,
        HistoryDetailComponent,
        HistoryListComponent
    ]
})
export class HistoryModule { }

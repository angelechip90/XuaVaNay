import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GeographyRoutingModule } from './geography-routing.module';
import { GeographyPage } from './pages/geography/geography.page';
import { GeographyDetailComponent } from './components/geography-detail/geography-detail.component';
import { GeographyListComponent } from './components/geography-list/geography-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        GeographyRoutingModule,
        GeographyPage,
        GeographyDetailComponent,
        GeographyListComponent
    ]
})
export class GeographyModule { }

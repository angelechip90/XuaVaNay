import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GeographyRoutingModule } from './geography-routing.module';
import { GeographyPage } from './pages/geography/geography.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        GeographyRoutingModule,
        GeographyPage,
    ]
})
export class GeographyModule { }

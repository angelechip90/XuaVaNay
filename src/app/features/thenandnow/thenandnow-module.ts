import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThenAndNowRoutingModule } from './thenandnow-routing.module';

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ThenAndNowRoutingModule
  ]
})
export class ThenandnowModule { }

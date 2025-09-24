import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Shared Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';

// Shared Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        LoadingSpinnerComponent,
        ErrorMessageComponent,
        CustomButtonComponent,
        DateFormatPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        LoadingSpinnerComponent,
        ErrorMessageComponent,
        CustomButtonComponent,
        DateFormatPipe
    ]
})
export class SharedModule { }

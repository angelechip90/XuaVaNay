import { Component, Input } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss'],
    imports: [IonButton, IonIcon, CommonModule],
    standalone: true
})
export class ErrorMessageComponent {
    @Input() message: string = '';
    @Input() showRetry: boolean = false;
    @Input() retryText: string = 'Thử lại';

    onRetry() {
        // Emit event hoặc callback
    }
}

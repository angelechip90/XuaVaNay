import { Component, Input } from '@angular/core';
import { IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss'],
    imports: [IonSpinner, CommonModule],
    standalone: true
})
export class LoadingSpinnerComponent {
    @Input() message: string = 'Đang tải...';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
}

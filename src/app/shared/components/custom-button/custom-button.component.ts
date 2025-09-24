import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-custom-button',
    templateUrl: './custom-button.component.html',
    styleUrls: ['./custom-button.component.scss'],
    imports: [IonButton, IonIcon, IonSpinner, CommonModule],
    standalone: true
})
export class CustomButtonComponent {
    @Input() text: string = '';
    @Input() type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() fill: 'solid' | 'outline' | 'clear' = 'solid';
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
    @Input() icon?: string;
    @Input() iconPosition: 'start' | 'end' = 'start';

    @Output() clicked = new EventEmitter<void>();

    onClick() {
        if (!this.disabled && !this.loading) {
            this.clicked.emit();
        }
    }
}

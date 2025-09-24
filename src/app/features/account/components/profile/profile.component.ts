import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, CommonModule],
    standalone: true
})
export class ProfileComponent {
    @Input() user: any;
}

import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-geography-detail',
    templateUrl: './geography-detail.component.html',
    styleUrls: ['./geography-detail.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, CommonModule],
    standalone: true
})
export class GeographyDetailComponent {
    @Input() geographyItem: any;
}

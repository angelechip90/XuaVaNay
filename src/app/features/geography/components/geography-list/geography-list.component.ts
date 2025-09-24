import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-geography-list',
    templateUrl: './geography-list.component.html',
    styleUrls: ['./geography-list.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
    standalone: true
})
export class GeographyListComponent {
    @Input() geographyItems: any[] = [];
}

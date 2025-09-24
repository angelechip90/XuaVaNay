import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, CommonModule],
    standalone: true
})
export class HistoryDetailComponent {
    @Input() historyItem: any;
}

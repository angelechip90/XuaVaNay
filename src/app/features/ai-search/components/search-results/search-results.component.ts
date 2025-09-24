import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
    standalone: true
})
export class SearchResultsComponent {
    @Input() results: any[] = [];
}

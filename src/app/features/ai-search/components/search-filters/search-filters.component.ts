import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonCheckbox, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-search-filters',
    templateUrl: './search-filters.component.html',
    styleUrls: ['./search-filters.component.scss'],
    imports: [IonCard, IonCardContent, IonCheckbox, IonLabel, CommonModule],
    standalone: true
})
export class SearchFiltersComponent {
    filters = [
        { label: 'Lịch sử', checked: false },
        { label: 'Địa lý', checked: false },
        { label: 'Văn hóa', checked: false }
    ];
}

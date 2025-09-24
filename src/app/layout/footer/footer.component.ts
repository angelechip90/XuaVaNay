import { Component } from '@angular/core';
import { IonFooter, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [IonFooter, IonToolbar, IonTitle, CommonModule],
    standalone: true
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}

import { Component } from '@angular/core';
import { IonNav } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    imports: [IonNav, CommonModule],
    standalone: true
})
export class NavigationComponent {
    // Navigation logic here
}

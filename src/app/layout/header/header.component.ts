import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonButtons, CommonModule],
    standalone: true
})
export class HeaderComponent {
    @Input() title: string = 'XuaVaNay';
    @Input() showBackButton: boolean = false;
    @Input() showMenuButton: boolean = false;
}

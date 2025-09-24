import { Component } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

interface Settings {
    notifications: boolean;
    darkMode: boolean;
    language: string;
}

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, CommonModule],
    standalone: true
})
export class SettingsComponent {
    settings: Settings = {
        notifications: true,
        darkMode: false,
        language: 'vi'
    };

    updateSetting(key: keyof Settings, value: boolean | string) {
        (this.settings as any)[key] = value;
        console.log('Setting updated:', key, value);
    }
}

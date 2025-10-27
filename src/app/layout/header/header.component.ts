import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  ],
  standalone: true,
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;
  @Input() templateEnd: TemplateRef<any> | null = null;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  goBack() {
    history.back();
  }
}

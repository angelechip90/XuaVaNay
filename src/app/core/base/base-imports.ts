import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonContent,
  IonIcon,
  IonInput,
  IonButton,
  IonCheckbox,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonHeader,
  IonToolbar,
  IonButtons,
} from '@ionic/angular/standalone';

// Centralized common imports for standalone components
export const BASE_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  // Frequently used Ionic standalone elements
  IonContent,
  IonIcon,
  IonInput,
  IonButton,
  IonCheckbox,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonHeader,
  IonToolbar,
  IonButtons,
];

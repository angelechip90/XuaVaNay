import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  checkmarkCircle
} from 'ionicons/icons';

interface Plan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  badge: string;
}

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.page.html',
  styleUrls: ['./upgrade.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardContent,
    CommonModule,
    FormsModule
  ]
})
export class UpgradePage implements OnInit {

  constructor() {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      checkmarkCircle
    });
  }
  displayName = signal('MiddleKien');

  ngOnInit() {
  }

  plan: Plan = {
    name: 'Chuyên gia',
    price: '950.000',
    period: '/năm',
    badge: 'LVAI PRO',
    tagline:
      'LV-AI hỗ trợ hỏi đáp, đọc sách đầy đủ, tiết kiệm và linh hoạt về thời gian.',
    features: [
      'Nội dung áp dụng 1',
      'Nội dung áp dụng 2',
      'Nội dung áp dụng 3',
      'Nội dung áp dụng 4',
      'Nội dung áp dụng 5',
    ],
  };

  onUpgrade() {
    // TODO: tích hợp flow thanh toán/nâng cấp
    console.log('Upgrade clicked');
  }

  goBack() {
    history.back();
  }
}

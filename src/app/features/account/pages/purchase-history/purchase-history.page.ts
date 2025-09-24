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
  bagRemoveOutline,
  diamondOutline
} from 'ionicons/icons';

type Status = 'expired' | 'active';
type Theme = 'free' | 'pro';

interface SubscriptionEntry {
  id: string;
  planName: string;      // KHỞI ĐẦU | LVAI PRO
  labelLeft: string;     // Miễn phí | Hội viên
  valueRight: string;    // 30 ngày | 1 năm
  status: Status;        // Hết hạn | Đang sử dụng
  startText: string;     // "9:28 20/08/2024"
  endText: string;       // "9:28 20/10/2024"
  theme: Theme;          // free | pro (để đổi icon/gradient)
}


@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.page.html',
  styleUrls: ['./purchase-history.page.scss'],
  standalone: true,
  imports: [IonContent,
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
    FormsModule]
})

export class PurchaseHistoryPage implements OnInit {

  constructor() {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      bagRemoveOutline,
      diamondOutline
    });
  }

  ngOnInit() {
  }

  displayName = signal('MiddleKien');

  entries = signal<SubscriptionEntry[]>([
    {
      id: 'starter',
      planName: 'KHỞI ĐẦU',
      labelLeft: 'Miễn phí',
      valueRight: '30 ngày',
      status: 'expired',
      startText: '9:28 20/08/2024',
      endText: '9:28 20/10/2024',
      theme: 'free',
    },
    {
      id: 'pro-2025',
      planName: 'LVAI PRO',
      labelLeft: 'Hội viên',
      valueRight: '1 năm',
      status: 'active',
      startText: '08:00 16/3/2025',
      endText: '08:00 16/3/2026',
      theme: 'pro',
    },
  ]);

  goBack() {
    history.back();
  }

  trackById = (_: number, e: SubscriptionEntry) => e.id;

}

import { Component, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  chevronForwardOutline,
  bookOutline,
  chatbubblesOutline,
  receiptOutline,
  keyOutline,
  logOutOutline,
  diamondOutline
} from 'ionicons/icons';

interface MemberInfo {
  name: string;
  email: string;
  planCode: string;   // "LVAI PRO"
  expireText: string; // "30/6/2026"
  avatarUrl: string;
  booksRead: number;
  qaHistory: number;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    CommonModule
  ],
  standalone: true
})
export class AccountPage implements OnInit {
  member = signal<MemberInfo>({
    name: 'Middle Kiên',
    email: 'middlekien@email.com',
    planCode: 'LVAI PRO',
    expireText: '30/6/2026',
    avatarUrl: 'https://placehold.co/130x130',
    booksRead: 9,
    qaHistory: 12,
  });

  constructor(private router: Router, private toast: ToastController) {
    addIcons({
      mailOutline,
      chevronForwardOutline,
      bookOutline,
      chatbubblesOutline,
      receiptOutline,
      keyOutline,
      logOutOutline,
      diamondOutline
    });
  }


  ngOnInit() { }

  openEmail() { this.router.navigateByUrl('/tabs/tab5/email'); }
  openReadBooks() { this.router.navigateByUrl('/book-readed'); }
  openQaHistory() { this.router.navigateByUrl('/chat-histories'); }
  openPurchaseHistory() { this.router.navigateByUrl('/purchase-history'); }
  openChangePassword() { this.router.navigateByUrl('/tabs/tab5/change-password'); }

  async signOut() {
    // TODO: tích hợp logic sign-out thực tế
    this.router.navigateByUrl('/login');
  }

  // Bottom nav (demo)
  navTo(tab: 'ai' | 'xuanay' | 'sudia' | 'docs' | 'account') {
    this.router.navigateByUrl(`/${tab}`);
  }
}

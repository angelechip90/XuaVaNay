import { Component, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  ToastController,
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
  diamondOutline,
} from 'ionicons/icons';
import { IUserInfo } from 'src/app/models/IUser.model';
import { ApiService } from 'src/app/core/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, CommonModule],
  standalone: true,
})
export class AccountPage implements OnInit {
  userInfo = signal<IUserInfo>({} as IUserInfo);

  constructor(
    private router: Router,
    private toast: ToastController,
    private api: ApiService
  ) {
    addIcons({
      mailOutline,
      chevronForwardOutline,
      bookOutline,
      chatbubblesOutline,
      receiptOutline,
      keyOutline,
      logOutOutline,
      diamondOutline,
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    let result = await firstValueFrom(this.api.execApi('auth', 'me', 'GET'));
    if (result && result?.Succeeded) {
      this.userInfo.set(result.Data);
    }
  }

  openEmail() {
    this.router.navigateByUrl('/tabs/tab5/email');
  }
  openReadBooks() {
    this.router.navigateByUrl('/book-readed');
  }
  openQaHistory() {
    this.router.navigateByUrl('/chat-histories');
  }
  openPurchaseHistory() {
    this.router.navigateByUrl('/purchase-history');
  }
  openChangePassword() {
    this.router.navigateByUrl('/change-password');
  }

  async signOut() {
    // TODO: tích hợp logic sign-out thực tế
    this.router.navigateByUrl('/login');
  }

  // Bottom nav (demo)
  navTo(tab: 'ai' | 'xuanay' | 'sudia' | 'docs' | 'account') {
    this.router.navigateByUrl(`/${tab}`);
  }
}

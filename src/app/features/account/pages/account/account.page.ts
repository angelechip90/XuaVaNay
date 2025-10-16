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
import { UserInfo } from 'src/app/models/User.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LanguageComponent } from 'src/app/shared/components/language/language.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, CommonModule, LanguageComponent],
  standalone: true,
})
export class AccountPage implements OnInit {
  userInfo = signal<UserInfo>({} as UserInfo);

  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService
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
    let result = await this.authService.getUserInfo().then((result) => {
      if (result) {
        this.userInfo.set(result as unknown as UserInfo);
      }
    });
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
  openUpgrade() {
    this.router.navigateByUrl('/upgrade');
  }
  async signOut() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login');
    });
  }

  // Bottom nav (demo)
  navTo(tab: 'ai' | 'xuanay' | 'sudia' | 'docs' | 'account') {
    this.router.navigateByUrl(`/${tab}`);
  }
}

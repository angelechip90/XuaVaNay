import { Component, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonButton,
  IonTitle,
} from '@ionic/angular/standalone';
import { ToastController, ModalController } from '@ionic/angular';
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
  cameraOutline,
  chevronBackOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { UserInfo, UserSubscription } from 'src/app/models/User.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LanguageComponent } from 'src/app/shared/components/language/language.component';
import { firstValueFrom } from 'rxjs';
import { APP_GetPhoto } from 'src/app/utils/appGetPhoto';
import { ModalPhotoCropperComponent } from 'src/app/modals/modal-photo-cropper/modal-photo-cropper.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/layout/header/header.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    LanguageComponent,
    TranslateModule,
    HeaderComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
  ],
  standalone: true,
})
export class AccountPage implements OnInit {
  userInfo = signal<UserInfo>({} as UserInfo);
  totalBookRead: any = 0;
  totalHistory: any = 0;
  subScription = signal<UserSubscription>({} as UserSubscription);

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
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
      cameraOutline,
      chevronBackOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadUserInfo();
    this.loadBookRead();
    this.loadHistoryConversations();
  }

  async loadUserInfo() {
    await this.authService.getUserInfo().then((result) => {
      if (result) {
        let user = result as unknown as UserInfo;
        this.api.execApi('UserSubscription', 'user', 'GET').subscribe((res) => {
          if (res && res.StatusCode == 200 && res.Succeeded) {
            let subs = res.Data;
            user.ActiveSubscription = subs;
          }
          this.userInfo.set(user);
        });
      }
    });
  }

  loadBookRead() {
    firstValueFrom(
      this.api.execApi('ReadBook', 'get-paging', 'GET', null, null)
    ).then((res: any) => {
      if (res) {
        this.totalBookRead = res?.TotalRecords;
      }
    });
  }

  loadHistoryConversations() {
    firstValueFrom(
      this.api.execApi('Chat', 'get-conversations', 'GET', null, null)
    ).then((res: any) => {
      if (res) {
        this.totalHistory = res?.TotalRecords;
      }
    });
  }

  openEmail() {
    this.router.navigateByUrl('/tabs/tab5/email');
  }
  openAccountInfo() {
    this.router.navigateByUrl('/account-info');
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

  async changeAvatar(ev: any) {
    APP_GetPhoto(
      {
        modalController: this.modalController,
        toastController: this.toastController,
      },
      async (files: any) => {
        if (files.length) {
          let modal = await this.modalController.create({
            component: ModalPhotoCropperComponent,
            componentProps: {
              file: files[0],
            },
            backdropDismiss: true,
            keyboardClose: true,
          });

          modal.onDidDismiss().then(async (e) => {
            if (e.role == 'submit' && e.data) {
              var file = e.data;
              const formData = new FormData();
              const fileName = (file && (file.name || 'avatar.png')) as string;
              formData.append('File', file as Blob, fileName);

              this.api
                .execApi(
                  'Account',
                  'upload-avatar',
                  'POST',
                  formData,
                  {
                    'api-version': '1.0',
                  },
                  true
                )
                .subscribe((res: any) => {
                  if (res?.Succeeded) {
                    this.userInfo.set({
                      ...this.userInfo(),
                      Avatar: res?.Data,
                    });
                  }
                });
            }
          });
          modal.present();
        }
      }
    );
  }

  goback() {
    history.back();
  }
}

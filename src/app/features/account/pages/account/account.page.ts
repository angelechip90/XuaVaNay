import { Component, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { ToastController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/layout/header/header.component';
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
import { firstValueFrom } from 'rxjs';
import { APP_GetPhoto } from 'src/app/utils/appGetPhoto';
import { ModalPhotoCropperComponent } from 'src/app/modals/modal-photo-cropper/modal-photo-cropper.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    LanguageComponent,
    HeaderComponent,
  ],
  standalone: true,
})
export class AccountPage implements OnInit {
  userInfo = signal<UserInfo>({} as UserInfo);
  totalBookRead: any = 0;
  totalHistory: any = 0;

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
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadUserInfo();
    this.loadBookRead();
    this.loadHistoryConversations();
  }

  async loadUserInfo() {
    let result = await this.authService.getUserInfo().then((result) => {
      if (result) {
        this.userInfo.set(result as unknown as UserInfo);
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

							// this.fileService
							// 	.upload({
							// 		file: file,
							// 		fileType: 'image',
							// 		subFolder: 'avatar',
							// 	})
							// 	.then((resUpload) => {
							// 		if (resUpload?.ReturnCode == 0) {
							// 			this.accountService
							// 				.updateAvatar({
							// 					Avatar: `${resUpload.path}/${resUpload.file.name}`,
							// 				})
							// 				.then((res) => {
							// 					if (res?.Succeeded) {
							// 						this.refreshData();
							// 					} else {
							// 						APP_COMPONENT_IonToast(
							// 							this.toastController,
							// 							{},
							// 							res
							// 						).then((toast) => toast.present());
							// 					}
							// 				});
							// 		} else {
							// 			APP_COMPONENT_IonToast(this.toastController, {
							// 				message: resUpload.ReturnName,
							// 				color: 'danger',
							// 			}).then((toast) => toast.present());
							// 		}
							// 	});
						}
					});

					modal.present();
				}
			}
		);
	}
}

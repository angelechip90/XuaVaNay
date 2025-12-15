import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { IonContent, IonIcon, IonModal, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  arrowBackOutline,
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  calendarOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  lockClosedOutline,
  closeOutline,
  createOutline,
} from 'ionicons/icons';
import { UserInfo } from 'src/app/models/User.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
  imports: [IonButton, 
    IonContent,
    IonIcon,
    CommonModule,
    TranslateModule,
    HeaderComponent,
    IonIcon,
    IonModal,
  ],
  standalone: true,
})
export class AccountInfoPage implements OnInit {
  userInfo = signal<UserInfo>({} as UserInfo);
  @ViewChild('modal') modal!: IonModal;
  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService
  ) {
    addIcons({
      chevronBackOutline,
      arrowBackOutline,
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      calendarOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      lockClosedOutline,
      closeOutline,
      createOutline,
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadUserInfo();
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

  editAccount() {
    this.router.navigateByUrl('/edit-account-info');
  }

  async removeAccount() {
    // Dismiss any modal if present before routing
    this.modal.dismiss();

    this.router.navigateByUrl('/delete-account-request');
  }

  goback() {
    history.back();
  }

  async openPolicy() {
    const url = environment.PrivacyPolicy;
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  async openTerms() {
    const url = environment.TermsofUse;
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }
}

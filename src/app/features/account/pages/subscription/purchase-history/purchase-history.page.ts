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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  bagRemoveOutline,
  diamondOutline,
  briefcaseOutline,
  informationCircle,
  bookOutline,
} from 'ionicons/icons';
import { UserInfo, UserSubscription } from '../../../../../models/User.model';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.page.html',
  styleUrls: ['./purchase-history.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
  ],
})
export class PurchaseHistoryPage implements OnInit {
  entries = signal<UserSubscription[]>([]);
  userInfo = signal<UserInfo>({} as UserInfo);
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      bagRemoveOutline,
      diamondOutline,
      briefcaseOutline,
      informationCircle,
      bookOutline,
    });
  }

  ngOnInit() {
    this.authService.getUserInfo().then((result) => {
      if (result) {
        this.userInfo.set(result as unknown as UserInfo);
        this.loadSubscriptionPlans();
      } else {
        this.authService.refreshToken().then(() => {
          if (result) this.loadSubscriptionPlans();
        });
      }
    });
  }

  async loadSubscriptionPlans() {
    let result = await firstValueFrom(
      this.apiService.execApi('UserSubscription', 'get-paging', 'GET', null, {
        SortYearDesc: true,
        PageNumber: 1,
        PageSize: 10,
      })
    );
    if (result && result?.Data && result?.Data?.length) {
      this.entries.set(result?.Data);
    }
  }

  goBack() {
    history.back();
  }

  trackById = (_: number, e: UserSubscription) => e.UserSubscriptionId;
}

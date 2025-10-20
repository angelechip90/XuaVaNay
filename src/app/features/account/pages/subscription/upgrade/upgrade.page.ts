import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  checkmarkCircle,
} from 'ionicons/icons';
import { ApiService } from 'src/app/core/services/api.service';
import { SubscriptionPlan } from 'src/app/models/User.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/layout/header/header.component';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.page.html',
  styleUrls: ['./upgrade.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class UpgradePage implements OnInit {
  plans = signal<SubscriptionPlan[]>([]);
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      checkmarkCircle,
    });
  }
  displayName: string = '';

  ngOnInit() {
    this.getAllPlans();
    this.authService.getUserInfo().then((res) => {
      this.displayName = res?.FullName ?? '';
    });
  }

  getAllPlans() {
    this.apiService
      .execApi('SubscriptionPlan', 'get-all?api-version=1.0', 'GET')
      .subscribe((res: any) => {
        if (res && res?.Data && res?.Data?.length) {
          this.plans.set(res?.Data);
        }
      });
  }

  onUpgrade(id: string) {
    this.apiService
      .execApi('Order', 'create', 'POST', {
        SubscriptionPlanId: '1c4a2214-9dbe-401a-9be6-83eed91d69a9', //Test id,
        Quantity: 1,
        CouponCode: '',
        Notes: '',
      })
      .subscribe((res: any) => {
        if (res && res.Succeeded && res?.Data) {
          this.router.navigateByUrl(`/order/${res?.Data?.Id}`);
        }
      });
  }

  goBack() {
    history.back();
  }
}

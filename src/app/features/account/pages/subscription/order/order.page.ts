import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonInput,
  IonIcon,
  IonRadio,
  IonRadioGroup,
  IonItem,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  bagRemoveOutline,
  diamondOutline,
  briefcaseOutline,
  informationCircle,
  bookOutline,
  cardOutline,
} from 'ionicons/icons';
import { Order } from 'src/app/models/Order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonInput,
    IonIcon,
    IonRadio,
    IonRadioGroup,
    IonItem,
    CommonModule,
    FormsModule,
  ],
})
export class OrderPage implements OnInit {
  promoCode: string = '';
  selectedMethod: string | null = null;
  order: Order | null = null;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      bagRemoveOutline,
      diamondOutline,
      briefcaseOutline,
      informationCircle,
      bookOutline,
      cardOutline,
    });
  }

  ngOnInit() {
    this.loadOrder();
  }

  loadOrder() {
    this.apiService
      .execApi(
        'Order',
        this.route.snapshot.params['id'],
        'GET',
        null,
        null,
        true
      )
      .subscribe((res: any) => {
        this.order = res?.Data;
      });
  }

  applyPromo() {
    if (this.promoCode.trim() !== '') {
      this.apiService
        .execApi(
          'Order',
          'apply-discount',
          'POST',
          {
            CouponCode: this.promoCode,
            OrderId: this.order?.Id,
          },
          null,
          true
        )
        .subscribe((res: any) => {
          if (res && res?.Succeeded && res?.Data) {
            this.order = res?.Data;
          }
        });
    }
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  checkout() {
    if (!this.selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    this.apiService
      .execApi(
        'Order',
        `payment/${this.order?.Id}/${this.selectedMethod}`,
        'GET',
        null,
        null,
        true
      )
      .subscribe((res: any) => {
        if (res && res?.Succeeded && res?.Data) {
          this.router.navigateByUrl(res.Data.PaymentUrl);
        }
      });
  }
}

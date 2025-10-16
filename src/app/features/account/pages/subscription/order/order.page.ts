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
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { TranslateModule } from '@ngx-translate/core';
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
import { Browser } from '@capacitor/browser';
import { PluginListenerHandle } from '@capacitor/core';
import { HeaderComponent } from 'src/app/layout/header/header.component';

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
    TranslateModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class OrderPage implements OnInit {
  promoCode: string = '';
  selectedMethod: string | null = null;
  order: Order | null = null;
  browserCloseListener?: PluginListenerHandle;
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
          this.openPayment(res.Data.PaymentUrl);
        }
      });
  }

  async openPayment(url: string) {
    this.browserCloseListener = await Browser.addListener(
      'browserFinished',
      () => {
        console.log('✅ Trình duyệt đã đóng, xử lý tiếp tại đây...');
        this.afterBrowserClosed();
      }
    );
    await Browser.open({
      url: url,
      presentationStyle: 'popover', // tùy chọn
    });
  }

  afterBrowserClosed() {
    // ví dụ: gọi API, reload dữ liệu, hoặc điều hướng lại
    console.log('Đang làm gì đó sau khi đóng trình duyệt...');
  }
}

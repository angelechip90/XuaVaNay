import {
  IonContent,
  IonItem,
  IonLabel,
  IonNote,
  IonChip,
  IonItemDivider,
  IonSkeletonText,
  IonList,
} from '@ionic/angular/standalone';
import { Component, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BASE_IMPORTS } from 'src/app/core/base/base-imports';
import { BaseComponent } from 'src/app/core/base/base.component';
import { Order } from 'src/app/models/Order.model';
import {
  checkmarkCircle,
  chevronBackOutline,
  ellipsisHorizontal,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HeaderComponent } from 'src/app/layout/header/header.component';

@Component({
  standalone: true,
  selector: 'app-order-detail-page',
  imports: [
    ...BASE_IMPORTS,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonChip,
    IonItemDivider,
    IonSkeletonText,
    HeaderComponent,
  ],
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage extends BaseComponent {
  id = this.route.snapshot.paramMap.get('id'); // nếu dùng /order/:id
  loading = false;

  order: Order | null = null;

  get statusText(): string {
    switch (this.order?.Status) {
      case 1:
        return this.translate.instant('orderDetail.statusText.paid');
      case 2:
        return this.translate.instant('orderDetail.statusText.failed');
      default:
        return this.translate.instant('orderDetail.statusText.processing');
    }
  }

  constructor(injector: Injector, private translate: TranslateService) {
    super(injector);
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      checkmarkCircle,
    });
    this.id = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit() {
    this.loadOrder();
  }

  loadOrder() {
    if (!this.id) return;
    this.api
      .execApi('Order', this.id ?? '', 'GET', null, null, true)
      .subscribe((res: any) => {
        this.order = res?.Data;
      });
  }
}

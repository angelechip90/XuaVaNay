import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/layout/header/header.component';
type OrderStatus = 'processing' | 'paid' | 'failed';

interface OrderSummary {
  planTitle: string;
  planAccent: string;
  durationLabel: string;
  orderCode: string;
  orderValue: number; // VND
  status: OrderStatus;
  paymentMethod: string;
  updatedAt: string | Date;
  discount: number; // VND (âm nếu giảm)
  totalPay: number; // VND
}

@Component({
  standalone: true,
  selector: 'app-order-detail-page',
  imports: [IonicModule, CommonModule, RouterModule, HeaderComponent],
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage {
  private route = inject(ActivatedRoute);

  id = this.route.snapshot.paramMap.get('id'); // nếu dùng /order/:id
  loading = false;

  order: OrderSummary = {
    planTitle: 'Gói',
    planAccent: 'ĐỌC TOÀN VĂN VÀ CHAT VỚI AI',
    durationLabel: '1 năm',
    orderCode: '565JYWBKL',
    orderValue: 1450000,
    status: 'processing',
    paymentMethod: 'Momo',
    updatedAt: new Date('2025-10-02T09:30:00+07:00'),
    discount: -50000,
    totalPay: 1400000,
  };

  get statusColor(): string {
    switch (this.order.status) {
      case 'paid':
        return 'success';
      case 'failed':
        return 'danger';
      default:
        return 'primary';
    }
  }

  get statusText(): string {
    switch (this.order.status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Đang xử lý';
    }
  }
}

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  bookmarkOutline,
  star,
  starHalfOutline,
  starOutline,
  playOutline,
  heartOutline,
  shareOutline,
  chatbubbleOutline
} from 'ionicons/icons';

interface Issue {
  id: string;
  title: string;
  cover: string;
}

interface Comment {
  name: string;
  time: string;
  avatar: string;
  content: string;
}

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    CommonModule
  ],
  standalone: true
})
export class BookDetailComponent implements OnInit {
  title = 'XƯA & NAY SỐ 562 (THÁNG 4.2024)';
  publisher = 'Tạp chí Xưa và Nay';
  ratingCount = 25;
  cover = 'https://placehold.co/201x273';
  backdrop = 'https://placehold.co/439x621';

  // tóm tắt (rút gọn / đầy đủ)
  fullSummary = `Trong số này:
Sự hình thành đường 1C và lực lượng thanh niên xung phong - Huỳnh Thị Gấm
Khảo sát Binh thư yếu lược (A.476) của Trần Quốc Tuấn qua góc độ lịch sử - Sun Laichen
Luận về danh xưng và quốc hiệu Việt Nam - Võ Vinh Quang
Sông Bạch Đằng và chiến thắng Bạch Đằng lịch sử: từ tên gọi đến thực địa - Lý Tùng Hiếu
Giọng Quảng Nam có tự bao giờ? - Hồ Trung Tú
Di sản lịch sử - văn hóa các đô thị Nam Bộ - Nhìn từ Gia Định thành thông chí - Nguyễn Thị Hậu
Anh hùng dân tộc Nguyễn Trung Trực - Lê Công Lý
Một số hình ảnh về thượng tướng Trần Văn Trà
Sự phát triển tôn giáo và triết lý mới ở Sài Gòn và Nam Kỳ trong thập niên 1920 và 1930 - Nguyễn Đức Hiệp
Kiến trúc sư Auguste Delaval và các công trình trong thời kỳ thuộc địa Pháp - Stefan Hell
Những người Nhật đầu tiên đến phương Tây - Trần Thanh Ái
Mệnh danh tự quy định việc đặt họ, tên trong hoàng tộc nhà Nguyễn - Tôn Thất Thọ
Về một bài phú của Ngô Thì Nhậm viết về Thái Nguyên - Nguyễn Đình Hưng
Nguyễn Thiệu Lâu, nhà địa lý học, sử học (1916-1967) - Ngô Thế Long
Nghệ thuật trang trí lăng hoàng gia tại Gò Công đầu thế kỷ XX - Nguyễn Đắc Thái`;
  expanded = signal(false);
  summary = computed(() => {
    if (this.expanded()) return this.fullSummary;
    const cut = this.fullSummary.split('\n').slice(0, 6).join('\n');
    return cut + ' …';
  });

  // số cùng tạp chí
  issues: Issue[] = [
    { id: '562', title: 'XƯA & NAY SỐ 562 (THÁNG 4.2024)', cover: 'https://placehold.co/120x163' },
    { id: '563', title: 'XƯA & NAY SỐ 563 (THÁNG 5.2024)', cover: 'https://placehold.co/120x163' },
    { id: '564', title: 'XƯA & NAY SỐ 564 (THÁNG 6.2024)', cover: 'https://placehold.co/120x163' },
  ];

  // bình luận
  comments: Comment[] = [
    {
      name: 'Middle Kien',
      time: '1 ngày trước',
      avatar: 'https://placehold.co/26x26',
      content:
        '“Nội dung bình luận Nội dung bình luậnNội dung bình luậnNội dung bình luậnNội dung bình luậnNội dung bình luận…”',
    },
    {
      name: 'Hồ Đắc Huy',
      time: '08:30 25/07/2025',
      avatar: 'https://placehold.co/26x26',
      content: '“Nội dung bình luận Nội dung bình luậnNội dung bình luậnNội dung bình luận”',
    },
  ];

  constructor(private toast: ToastController) {
    addIcons({
      chevronBackOutline,
      bookmarkOutline,
      star,
      starHalfOutline,
      starOutline,
      playOutline,
      heartOutline,
      shareOutline,
      chatbubbleOutline
    });
  }

  ngOnInit() { }

  goBack() { history.back(); }

  async readNow() {
    // TODO: điều hướng tới viewer đọc sách
    const t = await this.toast.create({ message: 'Mở chế độ đọc…', duration: 900, position: 'bottom' });
    t.present();
  }

  async readIssue(id: string) {
    const t = await this.toast.create({ message: `Đọc số ${id}…`, duration: 900, position: 'bottom' });
    t.present();
  }

  toggleExpanded() {
    this.expanded.update(v => !v);
  }
}

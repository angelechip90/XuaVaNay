import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonTextarea,
  IonFooter,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  sendOutline,
  homeOutline,
  libraryOutline,
  bookOutline,
  personOutline
} from 'ionicons/icons';

interface QuickTopic {
  label: string;
}

interface Suggestion {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonTextarea,
    IonFooter,
    CommonModule,
    FormsModule
  ],
  standalone: true
})
export class ChatComponent implements OnInit {
  greeting = signal('Chào ngày mới, tôi có thể giúp gì cho bạn ?');
  topics = signal<QuickTopic[]>([
    { label: 'Lịch sử' },
    { label: 'Nghệ thuật' },
    { label: 'Cảnh đẹp ba miền' },
    { label: 'Các trận chiến trong lịch sử' },
    { label: 'Xây dựng đất nước' },
  ]);

  suggestions = signal<Suggestion[]>([
    {
      title: 'Tên gọi sài gòn từ khi nào?',
      subtitle:
        'Thành phố Hồ Chí Minh là tên gọi chính thức từ tháng 7 năm 1976 khi được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam đổi tên từ Sài Gòn – Gia Định...',
    },
    {
      title: 'Thảo Cầm Viên có từ bao giờ?',
      subtitle:
        'Thảo Cầm Viên Sài Gòn tròn 160 tuổi. Công trình rộng 20 ha, được người Pháp xây dựng ...',
    },
  ]);

  drafting = signal('');

  constructor(private toast: ToastController) {
    addIcons({
      chevronBackOutline,
      sendOutline,
      homeOutline,
      libraryOutline,
      bookOutline,
      personOutline
    });
  }
  ngOnInit() { }

  goBack() { history.back(); }

  pickTopic(t: QuickTopic) {
    // Gợi ý nội dung từ chủ đề
    this.drafting.set(`Mình muốn tìm hiểu về: ${t.label}`);
  }

  useSuggestion(s: Suggestion) {
    this.drafting.set(s.title);
  }

  async send() {
    const q = this.drafting().trim();
    if (!q) return;
    const t = await this.toast.create({ message: 'Đã gửi câu hỏi', duration: 900 });
    t.present();
    // TODO: gọi API chat của bạn
    this.drafting.set('');
  }
}

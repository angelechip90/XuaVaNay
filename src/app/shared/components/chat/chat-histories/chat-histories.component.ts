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
  ellipsisHorizontal,
  micOutline,
  sendOutline
} from 'ionicons/icons';

type QAItem = {
  question: string;
  answer: string;
  time: string; // giữ dạng chuỗi để hiển thị đúng theo mock
};

@Component({
  selector: 'app-chat-histories',
  templateUrl: './chat-histories.component.html',
  styleUrls: ['./chat-histories.component.scss'],
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
export class ChatHistoriesComponent implements OnInit {
  query = signal('');

  // Dữ liệu mẫu bám sát mockup
  items = signal<QAItem[]>([
    {
      question: 'Lịch sử về Áo dài Việt Nam',
      answer: 'Chiếc áo dài truyền thống của dân tộc Việt Nam từ trước đến ...',
      time: '28 mins ago',
    },
    {
      question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
      answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
      time: '08:30 18/05/2025',
    },
    {
      question: 'Nội dung câu hỏi Nội dung câu hỏi',
      answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
      time: '11:15 10/04/2025',
    },
    {
      question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
      answer:
        'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lờiNội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lời',
      time: '20 days ago',
    },
    {
      question: 'Tiểu sử Vua Đinh Tiên Hoàng',
      answer: ' Đinh Tiên Hoàng là vị anh hùng dân tộc, mở đầu và đặt nền...',
      time: '3 days ago',
    },
    {
      question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
      answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
      time: '14:00 12/05/2025',
    },
    {
      question: 'Nội dung câu hỏi Nội dung câu hỏi',
      answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
      time: '09:15 06/02/2025',
    },
    {
      question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
      answer:
        'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lờiNội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lời',
      time: '2 months ago',
    },
  ]);

  constructor(private toast: ToastController) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      micOutline,
      sendOutline
    });
  }

  ngOnInit() { }

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.items();
    return this.items().filter(
      (it: QAItem) =>
        it.question.toLowerCase().includes(q) ||
        it.answer.toLowerCase().includes(q) ||
        it.time.toLowerCase().includes(q),
    );
  });

  // Chia làm 2 cột giống thiết kế
  leftCol = computed(() => this.filtered().filter((_: QAItem, i: number) => i % 2 === 0));
  rightCol = computed(() => this.filtered().filter((_: QAItem, i: number) => i % 2 === 1));

  goBack() {
    history.back();
  }

  async send() {
    const text = this.query().trim();
    if (!text) return;
    // TODO: gọi API search/ask thực tế
    const t = await this.toast.create({
      message: 'Đã gửi câu hỏi',
      duration: 900,
      position: 'bottom',
    });
    await t.present();
    this.query.set('');
  }

  voice() {
    // TODO: tích hợp Web Speech / native plugin
    console.log('Voice input…');
  }
}

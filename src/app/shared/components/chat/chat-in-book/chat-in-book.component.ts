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
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  sendOutline,
  homeOutline,
  libraryOutline,
  bookOutline,
  personOutline,
  downloadOutline,
  refreshOutline,
  shareSocialOutline,
  copyOutline
} from 'ionicons/icons';
import { InputChatComponent } from '../input-chat/input-chat.component';

type Role = 'user' | 'assistant';

interface RefCard {
  id: string;
  iconColor: 'yellow' | 'pink';
  summary: string;
  source: string;
}

interface Message {
  id: string;
  role: Role;
  author: string;
  avatar?: string;
  title?: string;      // tiêu đề ngắn (prompt)
  text?: string;       // nội dung dài
  refs?: RefCard[];    // các thẻ nguồn tham khảo
  kind?: 'text' | 'image';
}

@Component({
  selector: 'app-chat-in-book',
  templateUrl: './chat-in-book.component.html',
  styleUrls: ['./chat-in-book.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    CommonModule,
    FormsModule,
    InputChatComponent
],
  standalone: true
})
export class ChatInBookComponent implements OnInit {
  constructor(private toast: ToastController) {
    addIcons({
      chevronBackOutline,
      sendOutline,
      homeOutline,
      libraryOutline,
      bookOutline,
      personOutline,
      copyOutline,
      shareSocialOutline,
      refreshOutline,
      downloadOutline,
    });
  }

  ngOnInit() { }
  notifCount = signal(26);

  // Thread demo theo mockup
  msgs = signal<Message[]>([
    {
      id: 'm1',
      role: 'user',
      author: 'MiddleKien',
      avatar: '../../../assets/imgs/demo/1.png',
      title: 'Giới thiệu về Áo dài phụ nữ Việt Nam qua các thời kỳ lịch sử',
      refs: [
        {
          id: 'r1',
          iconColor: 'yellow',
          summary: 'Áo dài Việt Nam - Ý nghĩa lịch sử của áo dài qua các giai đoạn...',
          source: 'XƯA & NAY SỐ 571 (THÁNG 1.2025)',
        },
        {
          id: 'r2',
          iconColor: 'pink',
          summary: 'Sự xuất hiện của áo dài bắt nguồn từ áo giao lĩnh (năm 1744) – là kiểu dáng ...',
          source: 'BỘ TẠP CHÍ XƯA & NAY SỐ 2024',
        },
        {
          id: 'r3',
          iconColor: 'yellow',
          summary: 'Trải qua nhiều thời kỳ lịch sử, chiếc áo dài truyền thống Việt Nam chính thức ...',
          source: 'XƯA & NAY SỐ 571 (THÁNG 1.2025)',
        },
      ],
    },
    {
      id: 'm2',
      role: 'assistant',
      author: 'LACVIET AI',
      text:
        'Áo dài phụ nữ Việt Nam qua các thời kỳ lịch sử\n' +
        '1. Nguồn gốc và các kiểu áo truyền thống ban đầu\n' +
        'Áo dài phụ nữ Việt Nam có nguồn gốc lâu đời, phát triển từ các loại áo truyền thống như áo giao lĩnh, áo ngũ thân và áo tứ thân.\n' +
        'Áo giao lĩnh (1744) … tiện dụng … giữ nét đẹp dịu dàng của người phụ nữ [2][4].\n' +
        'Áo ngũ thân … năm mảnh vạt áo … tượng trưng cho ngũ thường … [6].',
      kind: 'text',
    },
    {
      id: 'm3',
      role: 'user',
      author: 'MiddleKien',
      avatar: '../../../assets/imgs/demo/1.png',
      title: 'Hình dáng áo dài thay đổi như thế nào? Hình dáng áo dài thay đổi như thế nào?',
    },
    {
      id: 'm4',
      role: 'assistant',
      author: 'LACVIET AI',
      text:
        'Phân tích chi tiết về sự thay đổi hình dáng áo dài\n' +
        'Áo dài … trải qua nhiều giai đoạn phát triển và biến đổi rõ rệt …\n' +
        '1. Nguồn gốc và các kiểu áo truyền thống sơ khai',
      kind: 'text',
    },
  ]);

  // Ô input
  drafting = signal('');

  onValueChange(value: string) {
    this.drafting.set(value);
  }

  onSendMessage(message: string) {
    this.drafting.set(message);
    this.send();
  }

  goBack() {
    history.back();
  }

  async copy(msg: Message) {
    if (!msg.text) return;
    await navigator.clipboard.writeText(msg.text);
    const t = await this.toast.create({ message: 'Đã copy nội dung', duration: 1000 });
    t.present();
  }

  share(msg: Message) {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: msg.author,
        text: msg.text ?? msg.title ?? '',
      });
    }
  }

  regenerate(msg: Message) {
    // TODO: Gọi API regen
    console.log('Regenerate for', msg.id);
  }

  download(msg: Message) {
    // TODO: tải ảnh / file nếu kind === 'image'
    console.log('Download for', msg.id);
  }

  send() {
    const q = this.drafting().trim();
    if (!q) return;
    this.msgs.update((arr) => [
      ...arr,
      { id: crypto.randomUUID(), role: 'user', author: 'MiddleKien', title: q, avatar: '../../../assets/imgs/demo/1.png' },
    ]);
    this.drafting.set('');
    // TODO: gọi API chat -> push assistant message
  }

  // Bottom nav
  navTo(tab: 'home' | 'xuanay' | 'sudia' | 'docs' | 'account') {
    console.log('goto:', tab);
  }
}

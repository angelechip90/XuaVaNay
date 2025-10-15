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
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  micOutline,
  sendOutline,
} from 'ionicons/icons';
import { InputChatComponent } from '../input-chat/input-chat.component';
import { ApiService } from 'src/app/core/services/api.service';
import { Conversation } from 'src/app/models/Conversation.model';

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
    CommonModule,
    InputChatComponent,
  ],
  standalone: true,
})
export class ChatHistoriesComponent implements OnInit {
  query = signal('');

  // Dữ liệu mẫu bám sát mockup
  conversations = signal<Conversation[]>([]);

  constructor(private toast: ToastController, private apiService: ApiService) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      micOutline,
      sendOutline,
    });
  }

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    this.apiService
      .execApi('Chat', 'get-conversations', 'GET', null, {
        pageSize: 10,
        pageIndex: 0,
      })
      .subscribe((res: any) => {
        if (res && res?.Data && res?.Data?.length) {
          this.conversations.set(res.data);
        } else this.sampleConversations();
      });
  }

  sampleConversations() {
    this.conversations.set([
      {
        ConversationId: '1',
        SubcriberId: '1',
        CreatedBy: 'admin',
        Title: 'Lịch sử về Áo dài Việt Nam',
        CreatedDate: '2025-01-01',
        TotalMessages: 1,
      },
      {
        ConversationId: '2',
        SubcriberId: '2',
        CreatedBy: 'admin',
        Title: 'Lịch sử về Áo dài Việt Nam',
        CreatedDate: '2025-01-01',
        TotalMessages: 2,
      },
      {
        ConversationId: '3',
        SubcriberId: '3',
        CreatedBy: 'admin',
        Title: 'Lịch sử về Áo dài Việt Nam',
        CreatedDate: '2025-01-01',
        TotalMessages: 3,
      },
      {
        ConversationId: '4',
        SubcriberId: '4',
        CreatedBy: 'admin',
        Title: 'Lịch sử về Áo dài Việt Nam',
        CreatedDate: '2025-01-01',
        TotalMessages: 4,
      },
    ]);
  }

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

  onValueChange(event: any) {
    this.query.set(event);
  }

  onSendMessage(event: any) {
    this.send();
  }
}

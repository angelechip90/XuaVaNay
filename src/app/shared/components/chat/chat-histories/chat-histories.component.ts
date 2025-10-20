import { Component, OnInit, signal, computed, Injector } from '@angular/core';
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
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  micOutline,
  sendOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/core/base/base.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { TimeagoPipe } from 'src/app/shared/pipes/timeago-pipe';
import { InputChatComponent } from '../input-chat/input-chat.component';

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
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    TimeagoPipe,
    InputChatComponent,
  ],
  standalone: true,
})
export class ChatHistoriesComponent extends BaseComponent{
  query = signal('');

  // Dữ liệu mẫu bám sát mockup
  // items = signal<QAItem[]>([
  //   {
  //     question: 'Lịch sử về Áo dài Việt Nam',
  //     answer: 'Chiếc áo dài truyền thống của dân tộc Việt Nam từ trước đến ...',
  //     time: '28 mins ago',
  //   },
  //   {
  //     question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
  //     answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
  //     time: '08:30 18/05/2025',
  //   },
  //   {
  //     question: 'Nội dung câu hỏi Nội dung câu hỏi',
  //     answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
  //     time: '11:15 10/04/2025',
  //   },
  //   {
  //     question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
  //     answer:
  //       'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lờiNội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lời',
  //     time: '20 days ago',
  //   },
  //   {
  //     question: 'Tiểu sử Vua Đinh Tiên Hoàng',
  //     answer: ' Đinh Tiên Hoàng là vị anh hùng dân tộc, mở đầu và đặt nền...',
  //     time: '3 days ago',
  //   },
  //   {
  //     question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
  //     answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
  //     time: '14:00 12/05/2025',
  //   },
  //   {
  //     question: 'Nội dung câu hỏi Nội dung câu hỏi',
  //     answer: 'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu...',
  //     time: '09:15 06/02/2025',
  //   },
  //   {
  //     question: 'Nội dung câu hỏi Nội dung câu hỏiNội dung câu hỏiNội dung câu hỏi',
  //     answer:
  //       'Nội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lờiNội dung Câu trả lời Nội dung Câu trả lờiNội dung Câu trả lời',
  //     time: '2 months ago',
  //   },
  // ]);

  // Chia làm 2 cột giống thiết kế
  // leftCol = computed(() => this.filtered().filter((_: QAItem, i: number) => i % 2 === 0));
  // rightCol = computed(() => this.filtered().filter((_: QAItem, i: number) => i % 2 === 1));
  lstData:any;
  isLoad:any = true;
  pageNum: any = 1;

  constructor(
    injector: Injector,
    private toast: ToastController
  ) {
    super(injector);
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      micOutline,
      sendOutline,
    });
  }

  ngOnInit() {
    //this.loadConversations();
  }

  ionViewWillEnter() {
    this.loadItem();
  }

  loadItem(isScroll: any = false): Promise<any> {
    return new Promise(async resolve => {
      if (!this.isLoad) resolve(false);
      let obj = {
        PageNumber: this.pageNum,
      }
      let result = await firstValueFrom(this.api.execApi('Chat', 'get-conversations', 'GET', null, obj, !isScroll));
      if (result && result?.Data && result?.Data?.length) {
        if (!this.lstData) this.lstData = [];
        if (!isScroll)
          this.lstData = result?.Data;
        else
          this.lstData = [...this.lstData, ...result?.Data];
        let totalRecord = result?.TotalRecords;
        if (this.lstData?.length == totalRecord) this.isLoad = false;
        this.changeDetectorRef.detectChanges();
      }
      console.log(this.lstData);
    });
  }

  async onIonInfinite(event: any) {
    if (this.isLoad) {
      this.pageNum = this.pageNum + 1;
      await this.loadItem(true);
      setTimeout(() => {
        (event as InfiniteScrollCustomEvent).target.complete();
      }, 200);
    }
  }

  // filtered = computed(() => {
  //   const q = this.query().toLowerCase().trim();
  //   if (!q) return this.items();
  //   return this.items().filter(
  //     (it: QAItem) =>
  //       it.question.toLowerCase().includes(q) ||
  //       it.answer.toLowerCase().includes(q) ||
  //       it.time.toLowerCase().includes(q),
  //   );
  // });

  goBack() {
    history.back();
  }

  async send(message: string) {
    if(!message){
      this.notificationSV.showError('Vui lòng nhập nội dụng của bạn');
      return;
    }
    let result = await firstValueFrom(this.api.execApi('UserSubscription', 'check-chat-eligibility','GET', null,null));
    if(result && result?.Data){
      let data = result?.Data;
      if(!data?.CanChat){
        this.notificationSV.showError(data?.Reason);
        return;
      }else{
        let obj = {
          Message: message
        }
        let result = await firstValueFrom(this.api.execApi('Chat', 'create-conversation', 'POST', obj, null, true));
        if (result && result?.Data) {
          let conversationId = result?.Data?.ConversationId;
          this.navCtrl.navigateForward('chat', { queryParams: { conversationId: conversationId, message: message, type: 'conversation' } });
        }
      }
    }
  }

  onValueChange(event: any) {
    this.query.set(event);
  }

  // onSendMessage(event: any) {
  //   this.send();
  // }

  goConversation(item:any){
    if(!item) return;
    this.navCtrl.navigateForward('chat', { queryParams: { conversationId: item?.ConversationId,type: 'conversation' } });
  }
}

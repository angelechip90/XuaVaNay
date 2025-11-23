import { Component, OnInit, signal, computed, Injector, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, ToastController,IonIcon,IonButton,IonButtons  } from '@ionic/angular/standalone';
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
  chatbubbleOutline,
} from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { BaseComponent } from 'src/app/core/base/base.component';
import { AuthStorageService } from 'src/app/core/services/auth.storeage.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { InputChatComponent } from '../../chat/input-chat/input-chat.component';
import { RatingStartComponent } from '../../rating-start/rating-start.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';

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
    IonContent,
    CommonModule,
    InputChatComponent,
    RatingStartComponent,
    HeaderComponent,
    IonIcon,
    IonButton,
    IonButtons
  ],
  standalone: true,
})
export class BookDetailComponent extends BaseComponent {
  @ViewChild('tmpToolbarEnd') tmpToolbarEnd: TemplateRef<any>;
  id: any;
  oData: any;
  rate: any = 0;
  //   title = 'XƯA & NAY SỐ 562 (THÁNG 4.2024)';
  //   publisher = 'Tạp chí Xưa và Nay';
  //   ratingCount = 25;
  //   cover = 'https://placehold.co/201x273';
  //   backdrop = 'https://placehold.co/439x621';

  //   // tóm tắt (rút gọn / đầy đủ)
  //   fullSummary = `Trong số này:
  // Sự hình thành đường 1C và lực lượng thanh niên xung phong - Huỳnh Thị Gấm
  // Khảo sát Binh thư yếu lược (A.476) của Trần Quốc Tuấn qua góc độ lịch sử - Sun Laichen
  // Luận về danh xưng và quốc hiệu Việt Nam - Võ Vinh Quang
  // Sông Bạch Đằng và chiến thắng Bạch Đằng lịch sử: từ tên gọi đến thực địa - Lý Tùng Hiếu
  // Giọng Quảng Nam có tự bao giờ? - Hồ Trung Tú
  // Di sản lịch sử - văn hóa các đô thị Nam Bộ - Nhìn từ Gia Định thành thông chí - Nguyễn Thị Hậu
  // Anh hùng dân tộc Nguyễn Trung Trực - Lê Công Lý
  // Một số hình ảnh về thượng tướng Trần Văn Trà
  // Sự phát triển tôn giáo và triết lý mới ở Sài Gòn và Nam Kỳ trong thập niên 1920 và 1930 - Nguyễn Đức Hiệp
  // Kiến trúc sư Auguste Delaval và các công trình trong thời kỳ thuộc địa Pháp - Stefan Hell
  // Những người Nhật đầu tiên đến phương Tây - Trần Thanh Ái
  // Mệnh danh tự quy định việc đặt họ, tên trong hoàng tộc nhà Nguyễn - Tôn Thất Thọ
  // Về một bài phú của Ngô Thì Nhậm viết về Thái Nguyên - Nguyễn Đình Hưng
  // Nguyễn Thiệu Lâu, nhà địa lý học, sử học (1916-1967) - Ngô Thế Long
  // Nghệ thuật trang trí lăng hoàng gia tại Gò Công đầu thế kỷ XX - Nguyễn Đắc Thái`;
  fullSummary = signal('');
  expanded = signal(false);
  summary = computed(() => {
    if (this.expanded()) return this.fullSummary();
    const cut = this.fullSummary().split('\n').slice(0, 6).join('\n');
    return cut + ' …';
  });

  // số cùng tạp chí
  issues: any;

  // bình luận
  comments: any;
  user: any;

  constructor(
    injector: Injector,
    private toast: ToastController,
    private authService: AuthService
  ) {
    super(injector);
    addIcons({
      chevronBackOutline,
      bookmarkOutline,
      star,
      starHalfOutline,
      starOutline,
      playOutline,
      heartOutline,
      shareOutline,
      chatbubbleOutline,
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    let user = await this.authService.getUserInfo();
    if (user) this.user = user;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loadData();
    }
  }

  async loadData() {
    let obj = {
      BookId: this.id,
    };
    const result = await firstValueFrom(
      forkJoin({
        books: this.api.execApi(
          'Book',
          `get/${this.id}`,
          'GET',
          null,
          null,
          true
        ),
        issues: this.api.execApi('Book', 'get-relateds', 'GET', null, obj),
        comments: this.api.execApi('Comment', 'get-paging', 'GET', null, obj),
      })
    );
    if (result) {
      if (result?.books) {
        this.oData = result?.books?.Data;
        if(this.oData?.Description) this.fullSummary.set(this.oData?.Description);
        else this.fullSummary.set('');
        
      }
      if (result?.comments) {
        this.comments = result?.comments?.Data;
      }
      if (result?.issues) {
        this.issues = result?.issues?.Data;
      }
    }
    this.changeDetectorRef.detectChanges();
    // let result = await firstValueFrom(this.api.execApi('Book', `get/${this.id}`,'GET', null,null, true));
    // if (result && result?.Data) {
    //   this.oData = result?.Data;
    //   this.fullSummary.set(this.oData?.Description);
    //   this.changeDetectorRef.detectChanges();
    // }
  }

  goBack() {
    history.back();
  }

  async readNow() {
    // TODO: điều hướng tới viewer đọc sách
    this.router.navigate(['/book-content', this.id]);
  }

  async chat() {
    let conversationId = null;
    let obj = {
      BookId: this.id,
    };
    let result2 = await firstValueFrom(
      this.api.execApi(
        'Chat',
        'get-book-conversations',
        'GET',
        null,
        obj,
        true
      )
    );
    if (result2 && result2?.Data?.length) {
      let lstData = result2?.Data;
      conversationId = lstData[0]?.BookConversationId;
    }
    this.navCtrl.navigateForward('chat', {
      queryParams: {
        conversationId: conversationId,
        type: 'book',
        bookID: this.id,
        bookName: this.oData?.Title,
      },
    });
    // let result = await firstValueFrom(
    //   this.api.execApi(
    //     'UserSubscription',
    //     'check-chat-eligibility',
    //     'GET',
    //     null,
    //     null
    //   )
    // );
    // if (result && result?.Data) {
    //   let data = result?.Data;
    //   if (!data?.CanChat) {
    //     this.notificationSV.showError(data?.Reason);
    //     return;
    //   } else {
    //     let conversationId = null;
    //     let obj = {
    //       BookId: this.id,
    //     };
    //     let result2 = await firstValueFrom(
    //       this.api.execApi(
    //         'Chat',
    //         'get-book-conversations',
    //         'GET',
    //         null,
    //         obj,
    //         true
    //       )
    //     );
    //     if (result2 && result2?.Data?.length) {
    //       let lstData = result2?.Data;
    //       conversationId = lstData[0]?.BookConversationId;
    //     }
    //     this.navCtrl.navigateForward('chat', {
    //       queryParams: {
    //         conversationId: conversationId,
    //         type: 'book',
    //         bookID: this.id,
    //       },
    //     });
    //   }
    // }
  }

  async readIssue(id: string) {
    // const t = await this.toast.create({ message: `Đọc số ${id}…`, duration: 900, position: 'bottom' });
    // t.present();
  }

  toggleExpanded() {
    this.expanded.update((v) => !v);
  }

  async send(message: string) {
    if (!message) {
      this.notificationSV.showError('Vui lòng nhập nội dụng của bạn');
      return;
    }
    let obj = {
      BookId: this.id,
      CommentText: message,
      Rating: this.rate,
    };
    let result = await firstValueFrom(
      this.api.execApi('Comment', 'create', 'POST', obj, null)
    );
    if (result && result?.Errors?.length) {
      this.notificationSV.showError(result?.Errors[0]);
    } else {
      this.loadData();
    }
    // if(result && result?.Data){
    //   let data = result?.Data;
    //   if(!data?.CanChat){
    //     this.notificationSV.showError(data?.Reason);
    //     return;
    //   }else{
    //     let obj = {
    //       Message: message
    //     }
    //     let result = await firstValueFrom(this.api.execApi('Chat', 'create-conversation', 'POST', obj, null, true));
    //     if (result && result?.Data) {
    //       let conversationId = result?.Data?.ConversationId;
    //       this.navCtrl.navigateForward('chat', { queryParams: { conversationId: conversationId, message: message, type: 'conversation' } });
    //     }
    //   }
    // }
  }

  valueChangeRate(event: any) {
    this.rate = event;
  }
}

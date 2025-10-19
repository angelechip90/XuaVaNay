import { Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonText,
  IonList,
  IonLabel,
  IonIcon,
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  sparklesOutline,
  libraryOutline,
  newspaperOutline,
  bookOutline,
  imagesOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/core/base/base.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonText,
    IonList,
    IonLabel,
    IonIcon,
    IonItem,
    CommonModule,
    FormsModule,
    SectionLogoComponent,
    SearchBoxComponent
  ]
})
export class HomePage extends BaseComponent{
  query = '';

  constructor(
    injector: Injector,
  ) {
    super(injector);
    addIcons({
      searchOutline,
      sparklesOutline,
      libraryOutline,
      newspaperOutline,
      bookOutline,
      imagesOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
  }

  onValueChange(query: string) {
    this.query = query;
    // TODO: gọi API / điều hướng sang trang kết quả
    // console.log('search:', this.query);
  }

  async onSendMessage(message: string) {
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

  onSuggestClick() {
    // TODO: mở sheet gợi ý / prompt mẫu
    // console.log('open suggestions');
  }

  navTo(tab: string) {
    // Footer tĩnh: bạn có thể dùng Router để điều hướng nếu đã có route
    // this.router.navigateByUrl(`/tabs/${tab}`);
  }
}

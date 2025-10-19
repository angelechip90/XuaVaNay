import { Component, ElementRef, Injector, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
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
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  sendOutline,
  homeOutline,
  libraryOutline,
  bookOutline,
  personOutline,
  settings
} from 'ionicons/icons';
import { InputChatComponent } from '../input-chat/input-chat.component';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom, retry } from 'rxjs';
import { AuthStorageService } from 'src/app/core/services/auth.storeage.service';
import { MarkdownComponent } from 'ngx-markdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth.service';

interface QuickTopic {
  label: string;
}

interface Suggestion {
  title: string;
  subtitle: string;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  thinkingSteps: ThinkingStep[];
  content: string;
  resources?: any[];
  relatedQuestions?: any[];
  error?: string;
}

interface ThinkingStep {
  step: string;
  title: string;
  content: string;
  tags: { type: string; data: any }[];
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
    ]),
  ],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonChip,
    IonLabel,
    CommonModule,
    FormsModule,
    InputChatComponent,
    MarkdownComponent,
  ],
  standalone: true
})
export class ChatsComponent extends BaseComponent {
  @ViewChild(IonContent) chatContent!: IonContent;
  conversationId: any;
  lstConversation: any = [];
  decoder = new TextDecoder();
  buffer = '';
  scrollTimeout: any;
  isRender:any = false;
  type:any;
  bookID:any;
  user:any;
  // greeting = signal('Chào ngày mới, tôi có thể giúp gì cho bạn ?');
  // topics = signal<QuickTopic[]>([
  //   { label: 'Lịch sử' },
  //   { label: 'Nghệ thuật' },
  //   { label: 'Cảnh đẹp ba miền' },
  //   { label: 'Các trận chiến trong lịch sử' },
  //   { label: 'Xây dựng đất nước' },
  // ]);

  // suggestions = signal<Suggestion[]>([
  //   {
  //     title: 'Tên gọi sài gòn từ khi nào?',
  //     subtitle:
  //       'Thành phố Hồ Chí Minh là tên gọi chính thức từ tháng 7 năm 1976 khi được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam đổi tên từ Sài Gòn – Gia Định...',
  //   },
  //   {
  //     title: 'Thảo Cầm Viên có từ bao giờ?',
  //     subtitle:
  //       'Thảo Cầm Viên Sài Gòn tròn 160 tuổi. Công trình rộng 20 ha, được người Pháp xây dựng ...',
  //   },
  // ]);

  // drafting = signal('');

  constructor(
    injector: Injector,
    private toast: ToastController,
    private authStorageService: AuthStorageService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private authService: AuthService
  ) {
    super(injector);
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      sendOutline,
      homeOutline,
      libraryOutline,
      bookOutline,
      personOutline
    });
  }
  async ngOnInit() {
    
  }

  async ionViewWillEnter() {
    let user = await this.authService.getUserInfo();
    if(user) this.user = user;
    this.conversationId = this.route.snapshot.queryParams['conversationId'];
    let message = this.route.snapshot.queryParams['message'];
    this.type = this.route.snapshot.queryParams['type'];
    this.bookID = this.route.snapshot.queryParams['bookID'];
    if(this.conversationId){
      await this.loadHistoryChat();
    }
    if (message) this.startChat(message);
  }

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'SUP') {
        const bookId = target.getAttribute('bookid');
        const pageIdx = target.getAttribute('pageidx');
        let queryParams = null;
        if (pageIdx != undefined) queryParams = { page: pageIdx };
        if (bookId != undefined) {
          this.router.navigate(['/book-content', bookId], {
            queryParams: queryParams,
          });
        }
      }
    });
  }

  async startChat(message:any) {
    if (!(this.lstConversation?.length > 0 && this.lstConversation[this.lstConversation.length - 1].role === 'user')) {
      let newMess = {
        role: 'user',
        content: message
      }
      this.lstConversation.push(newMess);
    }
    let newMessage:any = {
      showResearch: false,
      role:'assistant',
      isNew:true
    };
    this.lstConversation.push(newMessage);
    this.isRender = true;

    let user = this.authStorageService.getCurrentUser();
    let token = user?.Token?.AccessToken;
    let obj:any = {
      ConversationId: this.conversationId,
      Message: message,
    };
    let url = '';
    if(this.type == 'conversation'){
      url = `${this.severUrl}api/Chat/completion/chat-search/stream`;
    }else{
      obj['BookId'] = this.bookID;
      url = `${this.severUrl}api/Chat/completion/chat-book/stream`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok){
      this.notificationSV.showError('Đã có lỗi trong quá trình thực thi hệ thống! Vui lòng thử lại');
      return;
    }
    const reader: any = response?.body?.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      if (done){
        this.isRender = false;
        newMessage['isNew'] = false;
        break;
      }
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            this.isRender = false;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              console.log(data);
            }
            newMessage = this.convertMessage(newMessage,parsed,false);
          } catch (error) {
            console.log(error);         
          }
        }
      }
    }
    newMessage['isShowResourceRefs'] = true;
  }

  async loadHistoryChat(){
    let obj:any = {
      ConversationId:this.conversationId
    }

    let url = '';
    if(this.type == 'conversation'){
      url = 'get-conversation-messages';
    }else{
      obj['BookId'] = this.bookID;
      url = 'get-book-conversation-messages';
    }

    let result = await firstValueFrom(this.api.execApi('Chat', url,'GET', null,obj, true));
    if(result && result?.Data?.length){
      let lstData = result?.Data;
      lstData.reverse();
      for(let item of lstData){
        if(item?.Role === 'user'){
          let newMess = {
            role:'user',
            content:item?.Content
          }
          this.lstConversation.push(newMess);
        }else{
          let lstJSON:any = [];
          let json = item?.MetadataAsJson;
          if(json){
            try {
              let jsParse = JSON.parse(json);
              if(jsParse && jsParse?.length) lstJSON = [...lstJSON,jsParse];
            } catch (error) {
              
            }
          }
          if (item?.Content) {
            let newJS = {
              ThinkMessage: item?.Content,
              Type: 'text'
            }
            lstJSON.push(newJS);
          }
          let newMessage: any = {
            showResearch: false,
            role: 'assistant',
          };
          this.lstConversation.push(newMessage);
          for (let js of lstJSON) {
            newMessage = this.convertMessage(newMessage, js);
          }
        }
      }
    } 
  }

  convertMessage(newMessage:any,jsonParse:any,isShowResourceRefs:any = true){
    if (newMessage) {
      if (!newMessage.currentStep) newMessage['currentStep'] = '';
      let message = jsonParse.Message || jsonParse?.ThinkMessage;
      let messageType = jsonParse.Type;
      let step = jsonParse?.Step ?? '';
      let tag = jsonParse?.Tag ?? '';

      switch (messageType) {
        case 'has_thinking':
          newMessage.showResearch = true;
          break;
        case 'thinking':
          if (step !== newMessage?.currentStep) {
            newMessage.currentStep = step;
            if (!newMessage['researchItems']) newMessage['researchItems'] = [];
            message = this.sanitizer.bypassSecurityTrustHtml(message);
            let obj = {
              recID: uuidv4(),
              step,
              message,
              expanded: true
            }
            newMessage['researchItems'].push(obj);
          } else {
            let currentItem = newMessage['researchItems'].find((x: any) => x?.step === step);
            if (!currentItem) return;
            switch (tag) {
              case 'search_react':
              case 'search_description':
              case 'analysis':
                message = this.sanitizer.bypassSecurityTrustHtml(message);
                currentItem['message'] = message;
                break;
              case 'search_queries':
                try {
                  let query = JSON.parse(message);
                  if (query && Array.isArray(query)) {
                    if (!currentItem['searchQueries']) currentItem['searchQueries'] = [];
                    currentItem['searchQueries'] = [...currentItem['searchQueries'], ...query];
                  }
                } catch (e) {
                }
                break;
              case 'reading_sources':
                try {
                  let readingSources = JSON.parse(message);
                  if (readingSources && Array.isArray(readingSources)) {
                    if (!currentItem['readingSources']) currentItem['readingSources'] = [];
                    currentItem['readingSources'] = [...currentItem['readingSources'], ...readingSources];
                  }
                } catch (e) {
                }
                break;
            }

            if (step == 'wrapping_up') {
              message = this.sanitizer.bypassSecurityTrustHtml(message);
              currentItem['message'] = message;
              currentItem['isWrappingUp'] = true;
            }
            if (step == 'detailed_analysis') {
              message = this.sanitizer.bypassSecurityTrustHtml(message);
              currentItem['message'] = message;
              currentItem['isDetailedAnalysis'] = true;
            }
          }
          this.smoothScroll(100);
          break;
        case 'resource_reference':
          try {
            let resourceRefs = JSON.parse(message);
            if (resourceRefs && Array.isArray(resourceRefs)) {
              newMessage['resourceRefs'] = resourceRefs;
              newMessage['isShowResourceRefs'] = isShowResourceRefs;
            }
          } catch (e) {
          }
          this.smoothScroll(100);
          break;
        case 'question_related':
          let questionRelateds = JSON.parse(message);
          if (questionRelateds && Array.isArray(questionRelateds)) {
            newMessage['questionRelateds'] = questionRelateds;
          }
          this.smoothScroll(100);
          break;
        case 'text':
          newMessage['isShowAnswer'] = true;
          newMessage['answer'] = '';
          let msgAns = this.prepareMathJax(message);
          msgAns = marked.parse(msgAns, { breaks: false });
          message = this.sanitizer.bypassSecurityTrustHtml(msgAns);
          newMessage['answer'] = message;
          this.smoothScroll(100);
          break;
        case 'error':
          newMessage['isShowAnswerError'] = true;
          newMessage['answerError'] = '';
          let msg = this.prepareMathJax(message);
          msg = marked.parse(msg, { breaks: false });
          message = this.sanitizer.bypassSecurityTrustHtml(msg);
          newMessage['answerError'] = message;
          this.smoothScroll(100);
          break;
      }

    }
    return newMessage;
  }

  scrollToBottom(duration = 300) {
    if (this.chatContent) {
      this.chatContent.scrollToBottom(duration);
    }
  }

  smoothScroll(duration = 100) {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => this.scrollToBottom(duration), 20);
  }

  readBook(item:any){
    if(item && item?.BookId){
      this.router.navigate(['/book-content', item?.BookId]);
    }
  }

  query(query:any){
    if(query){
      this.smoothScroll(100);
      this.startChat(query);
    }
  }

  readBookByPage(bookId:any,page:any){
    let queryParams = null;
    if(page != undefined) queryParams = {page:page};
    if(bookId != undefined){
      this.router.navigate(['/book-content', bookId], {
        queryParams: queryParams,
      });
    }
  }

  goBack() { history.back(); }

  prepareMathJax(content: any) {
    return content.replace(/\\/g, "\\\\");
  }

  renderTooltip() {
    // Initialize tooltips
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })

    // // Add click handlers for demonstration
    // document.querySelectorAll('.btn-toolbar-custom').forEach(button => {
    //   button.addEventListener('click', function () {
    //     if (!this.classList.contains('dropdown-toggle')) {
    //       console.log('Button clicked:', this.getAttribute('title') || 'Button');
    //     }
    //   });
    // });
  }
  
  onValueChange(value: string) {
    //this.drafting.set(value);
  }

  async onSendMessage(message: string) {
    if(this.isRender) return;
    if(message){
      if(!this.conversationId){
        if(this.type == 'book'){
          let obj = {
            BookId: this.bookID,
            Message:message
          }
          let result = await firstValueFrom(this.api.execApi('Chat', 'create-book-conversation', 'POST', obj, null, true));
          if (result && result?.Data) {
            this.conversationId = result?.Data?.ConversationId;
          }
        }
      }
      if(!this.conversationId) return;
      this.smoothScroll(100);
      this.startChat(message);
    }
  }
}

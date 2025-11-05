import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonContent, ToastController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  sendOutline,
  homeOutline,
  libraryOutline,
  bookOutline,
  personOutline,
  settings,
} from 'ionicons/icons';
import { InputChatComponent } from '../input-chat/input-chat.component';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom, retry } from 'rxjs';
import { AuthStorageService } from 'src/app/core/services/auth.storeage.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth.service';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BASE_IMPORTS } from 'src/app/core/base/base-imports';
import { SearchBoxComponent } from '../../search-box/search-box.component';
import { TimeagoPipe } from 'src/app/shared/pipes/timeago-pipe';

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
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
  imports: [...BASE_IMPORTS, InputChatComponent, HeaderComponent, IonTitle, SearchBoxComponent, IonFooter,TimeagoPipe,],
  standalone: true,
})
export class ChatsComponent extends BaseComponent {
  @ViewChild(IonContent) chatContent!: IonContent;
  conversationId: any;
  lstConversation: any = [];
  decoder = new TextDecoder();
  buffer = '';
  scrollTimeout: any;
  isRender: any = false;
  type: any = 'conversation';
  bookID: any;
  user: any;
  isLoad: any = true;
  pageNum: any = 1;
  bookName:any = '';
  message:any = '';
  listHistory:any;

  constructor(
    injector: Injector,
    private toast: ToastController,
    private authStorageService: AuthStorageService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    super(injector);
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      sendOutline,
      homeOutline,
      libraryOutline,
      bookOutline,
      personOutline,
    });
  }
  async ngOnInit() {}

  async ionViewWillEnter() {
    let user = await this.authService.getUserInfo();
    if (user) this.user = user;
    let conversationId = this.route.snapshot.queryParams['conversationId'];
    if(conversationId) this.conversationId = conversationId;
    let message = this.route.snapshot.queryParams['message'];
    if(message) this.message = message;
    let type = this.route.snapshot.queryParams['type'];
    if(type) this.type = type;
    let bookID = this.route.snapshot.queryParams['bookID'];
    if(bookID) this.bookID = bookID;
    let bookName = this.route.snapshot.queryParams['bookName'];
    if(bookName) this.bookName = bookName;
    await this.loadItem();
    if (this.lstConversation && this.lstConversation?.length == 0) {
      this.loadHistoryChat();
    }
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

  async startChat(message: any) {
    this.smoothScroll(100);
    let validate = await this.checkEligibility();
    if(!validate) return;
    await this.createConversation(message);
    if(!this.conversationId) return;
    if (
      !(
        this.lstConversation?.length > 0 &&
        this.lstConversation[this.lstConversation.length - 1].role === 'user'
      )
    ) {
      let newMess = {
        role: 'user',
        content: message,
      };
      this.lstConversation.push(newMess);
    }
    let newMessage: any = {
      showResearch: false,
      role: 'assistant',
      isNew: true,
    };
    this.lstConversation.push(newMessage);
    this.isRender = true;

    let user = this.authStorageService.getCurrentUser();
    let token = user?.Token?.AccessToken;
    let obj: any = {
      ConversationId: this.conversationId,
      Message: message,
    };
    let url = '';
    if (this.type == 'conversation') {
      url = `${this.severUrl}api/Chat/completion/chat-search/stream`;
    } else {
      obj['BookId'] = this.bookID;
      url = `${this.severUrl}api/Chat/completion/chat-book/stream`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      this.notificationSV.showError(
        this.translate.instant('common.errorTryAgain')
      );
      return;
    }
    const reader: any = response?.body?.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      if (done) {
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
            newMessage = this.convertMessage(newMessage, parsed, false);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    newMessage['isShowResourceRefs'] = true;
  }

  loadItem(isScroll: any = false): Promise<any> {
    return new Promise(async (resolve) => {
      if(!this.conversationId){
        this.isLoad = false;
        if (this.message) this.startChat(this.message);
        resolve(false);
      }
      let obj: any = {
        ConversationId: this.conversationId,
        PageNumber: this.pageNum,
      };

      let url = '';
      if (this.type == 'conversation') {
        url = 'get-conversation-messages';
      } else {
        obj['BookId'] = this.bookID;
        url = 'get-book-conversation-messages';
      }

      let result = await firstValueFrom(
        this.api.execApi('Chat', url, 'GET', null, obj, true)
      );
      if (result && result?.Data?.length) {
        if (!this.lstConversation) this.lstConversation = [];
        let lstData = result?.Data;
        lstData.reverse();
        for (let item of lstData) {
          if (item?.Role === 'user') {
            let newMess = {
              role: 'user',
              content: item?.Content,
            };
            this.lstConversation.push(newMess);
          } else {
            let lstJSON: any = [];
            let json = item?.MetadataAsJson;
            if (json) {
              try {
                let jsParse = JSON.parse(json);
                if (jsParse && jsParse?.length) lstJSON = [...lstJSON, jsParse];
              } catch (error) {}
            }
            if (item?.Content) {
              let newJS = {
                ThinkMessage: item?.Content,
                Type: 'text',
              };
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
        let totalRecord = result?.TotalRecords;
        if (this.lstConversation?.length == totalRecord){
          this.smoothScroll(100);
          this.isLoad = false;
          if (this.message) this.startChat(this.message);
        }else{
          this.pageNum = this.pageNum + 1;
          this.loadItem();
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  // async onIonInfinite(event: any) {
  //   if (this.isLoad) {
  //     this.pageNum = this.pageNum + 1;
  //     await this.loadItem(true);
  //     setTimeout(() => {
  //       (event as InfiniteScrollCustomEvent).target.complete();
  //     }, 200);
  //   }
  // }

  async checkEligibility(){
    let result = await firstValueFrom(
      this.api.execApi(
        'UserSubscription',
        'check-chat-eligibility',
        'GET',
        null,
        null
      )
    );
    if (result && result?.Data) {
      let data = result?.Data;
      if (!data?.CanChat) {
        this.notificationSV.showError(data?.Reason);
        return false;
      }else{
        return true
      }
    }
    return false;
  }

  async createConversation(message:any){
    if (!this.conversationId) {
      let url = '';
      let obj:any = {
        Message: message,
      }
      if(this.type == 'conversation'){
        url = 'create-conversation';
      }
      if (this.type == 'book') {
        url = 'create-book-conversation';
        obj['BookId'] = this.bookID;
      }
      let result = await firstValueFrom(
        this.api.execApi(
          'Chat',
          url,
          'POST',
          obj,
          null,
        )
      );
      if (result && result?.Data) {
        this.conversationId = result?.Data?.ConversationId;
      }
    }
  }

  convertMessage(
    newMessage: any,
    jsonParse: any,
    isShowResourceRefs: any = true
  ) {
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
              expanded: true,
            };
            newMessage['researchItems'].push(obj);
          } else {
            let currentItem = newMessage['researchItems'].find(
              (x: any) => x?.step === step
            );
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
                    if (!currentItem['searchQueries'])
                      currentItem['searchQueries'] = [];
                    currentItem['searchQueries'] = [
                      ...currentItem['searchQueries'],
                      ...query,
                    ];
                  }
                } catch (e) {}
                break;
              case 'reading_sources':
                try {
                  let readingSources = JSON.parse(message);
                  if (readingSources && Array.isArray(readingSources)) {
                    if (!currentItem['readingSources'])
                      currentItem['readingSources'] = [];
                    currentItem['readingSources'] = [
                      ...currentItem['readingSources'],
                      ...readingSources,
                    ];
                  }
                } catch (e) {}
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
          //this.smoothScroll(100);
          break;
        case 'resource_reference':
          try {
            let resourceRefs = JSON.parse(message);
            if (resourceRefs && Array.isArray(resourceRefs)) {
              newMessage['resourceRefs'] = resourceRefs;
              newMessage['isShowResourceRefs'] = isShowResourceRefs;
            }
          } catch (e) {}
          this.smoothScroll(100);
          break;
        case 'question_related':
          let questionRelateds = JSON.parse(message);
          if (questionRelateds && Array.isArray(questionRelateds)) {
            newMessage['questionRelateds'] = questionRelateds;
          }
          //this.smoothScroll(100);
          break;
        case 'text':
          newMessage['isShowAnswer'] = true;
          newMessage['answer'] = '';
          let msgAns = this.prepareMathJax(message);
          msgAns = marked.parse(msgAns, { breaks: false });
          message = this.sanitizer.bypassSecurityTrustHtml(msgAns);
          newMessage['answer'] = message;
          //this.smoothScroll(100);
          break;
        case 'error':
          newMessage['isShowAnswerError'] = true;
          newMessage['answerError'] = '';
          let msg = this.prepareMathJax(message);
          msg = marked.parse(msg, { breaks: false });
          message = this.sanitizer.bypassSecurityTrustHtml(msg);
          newMessage['answerError'] = message;
          //this.smoothScroll(100);
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

  readBook(item: any) {
    if (item && item?.BookId) {
      this.router.navigate(['/book-content', item?.BookId]);
    }
  }

  query(query: any) {
    if (query) {
      this.startChat(query);
    }
  }

  readBookByPage(bookId: any, page: any) {
    let queryParams = null;
    if (page != undefined) queryParams = { page: page };
    if (bookId != undefined) {
      this.router.navigate(['/book-content', bookId], {
        queryParams: queryParams,
      });
    }
  }

  goBack() {
    history.back();
  }

  prepareMathJax(content: any) {
    return content.replace(/\\/g, '\\\\');
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
    if (this.isRender) return;
    this.startChat(message);
  }

  async loadHistoryChat() {
    let obj = {
      PageNumber: 1,
    };
    let result = await firstValueFrom(
      this.api.execApi(
        'Chat',
        'get-conversations',
        'GET',
        null,
        obj,
        false
      )
    );
    if (result && result?.Data && result?.Data?.length) {
      if (!this.listHistory) this.listHistory = [];
      this.listHistory = result?.Data;
      this.listHistory = this.listHistory.slice(0, 3);
      console.log(this.listHistory);
      this.changeDetectorRef.detectChanges();
    }
  }

  goConversation(item:any){
    if (!item) return;
    this.conversationId = item?.ConversationId;
    this.loadItem();
  }
}

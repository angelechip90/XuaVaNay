import {
  Component,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  Injector,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent ,IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  listOutline,
  chevronForwardOutline,
  boat,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom } from 'rxjs';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from 'src/app/layout/header/header.component';

@Component({
  selector: 'app-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.scss'],
  imports: [IonContent, CommonModule, PdfViewerModule, HeaderComponent,IonIcon],
  standalone: true,
})
export class BookContentComponent extends BaseComponent {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren('pageEl') pageEls!: QueryList<HTMLElement>;
  id: any;
  oData: any;
  linkPDF: any;
  page: any = 1;
  totalPages = 0;
  observer: IntersectionObserver | null = null;
  isLoadPdf:any = false
  constructor(injector: Injector, private zone: NgZone) {
    super(injector);
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      listOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    let page = this.route.snapshot.queryParams['page'];
    if (page != undefined) this.page = page;
    if (this.id) {
      this.loadData();
    }
  }

  ionViewWillLeave() {
    this.creatReadBook();
  }

  ngOnDestroy() {
    //this.creatReadBook();
  }

  ngAfterViewInit() {
    this.setupPageObserver();
    //setTimeout(() => this.scrollTo(this.current()), 0);
  }

  async loadData() {
    let result = await firstValueFrom(
      this.api.execApi('Book', `get/${this.id}`, 'GET', null, null, true)
    );
    if (result && result?.Data) {
      this.oData = result?.Data;
      // let link= '';
      // switch(this.oData?.BookType){
      //   case 1:
      //     link = `${environment.severUrl}File/tap_chi/`
      //     break;
      //   case 2:
      //     link = `${environment.severUrl}File/tap_san_su_dia/`
      //     break;
      //   case 3:
      //     link = `${environment.severUrl}File/sach_bao/`
      //     break;
      // }
      // link += this.oData?.FileName;
      this.linkPDF = this.oData?.Link;
      if (this.linkPDF) this.api.isLoad(true);
    }
    this.changeDetectorRef.detectChanges();
    console.log(result);
  }

  creatReadBook() {
    let obj = {
      BookId: this.id,
      ReadingStatus: 'Reading',
      CurrentPage: this.page,
    };
    firstValueFrom(
      this.api.execApi('ReadBook', 'create', 'POST', obj, null)
    ).then((res: any) => {
      console.log(res);
    });
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.api.isLoad(false);
    this.totalPages = pdf.numPages;
    if (this.page == undefined) this.page = 0;
    setTimeout(() => {
      const pageEl = document.querySelector(
        `.page[data-page-number="${this.page}"]`
      );
      if (pageEl) {
        if (this.page != 1)
          pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.creatReadBook();
      this.setupPageObserver();
    }, 500);
    this.isLoadPdf = true;
    this.changeDetectorRef.detectChanges();
  }

  setupPageObserver() {
    if (this.observer) this.observer.disconnect();

    const pages = document.querySelectorAll('.page');
    if (!pages.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        let visiblePages = entries
          .filter((e) => e.isIntersecting)
          .map((e) =>
            Number((e.target as HTMLElement).getAttribute('data-page-number'))
          );

        if (visiblePages.length > 0) {
          // Chọn trang giữa (hoặc trang nhỏ nhất nếu cuộn lên)
          const current = Math.min(...visiblePages);
          this.zone.run(() => (this.page = current));
        }
      },
      { threshold: 0.5 } // Trang chiếm ít nhất 50% viewport sẽ được coi là "hiển thị"
    );

    pages.forEach((p) => this.observer!.observe(p));
  }

  onError(event: any) {
    console.log(event);
  }

  async goBack() {
    await this.creatReadBook();
    history.back();
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

  // scrollTo(n: number) {
  //   const idx = Math.max(1, Math.min(n, this.totalPages));
  //   this.current.set(idx);
  //   const el = document.getElementById(`page-${idx}`);
  //   if (el) {
  //     // cuộn mượt tới ảnh tương ứng
  //     const y = el.getBoundingClientRect().top + (document.scrollingElement?.scrollTop || 0) - 80;
  //     this.content.scrollToPoint(0, y, 350);
  //   }
  // }

  // prev() { this.scrollTo(this.current() - 1); }
  // next() { this.scrollTo(this.current() + 1); }

  // openToc() { /* TODO: mở mục lục */ }
  // toggleView() { /* TODO: đổi chế độ xem (fit width/height) */ }
  // more() { /* TODO: menu phụ */ }
}

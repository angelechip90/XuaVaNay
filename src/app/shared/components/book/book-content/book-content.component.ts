import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  Injector,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  listOutline,
  chevronForwardOutline,
  addOutline,
  removeOutline,
} from 'ionicons/icons';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom } from 'rxjs';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.scss'],
  imports: [
    IonContent,
    CommonModule,
    NgxExtendedPdfViewerModule,
    HeaderComponent,
    IonIcon,
  ],
  standalone: true,
})
export class BookContentComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('pdf') pdf: NgxExtendedPdfViewerComponent;
  @ViewChildren('pageEl') pageEls!: QueryList<HTMLElement>;
  id: any;
  oData: any;
  linkPDF: any;
  page: any = 1;
  totalPages = 0;
  observer: IntersectionObserver | null = null;
  isLoadPdf: any = false;
  zoom = 1.2;

  constructor(injector: Injector, private zone: NgZone) {
    super(injector);
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      listOutline,
      chevronForwardOutline,
      addOutline,
      removeOutline,
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
  }

  async loadData() {
    let result = await firstValueFrom(
      this.api.execApi('Book', `get/${this.id}`, 'GET', null, null, true)
    );
    if (result && result?.Data) {
      this.oData = result?.Data;
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
    ).then((res: any) => {});
  }

  onPagesLoaded(event: { pagesCount: number }) {
    console.log(this.pdf);
    this.totalPages = event.pagesCount;
    this.isLoadPdf = true;
    this.api.isLoad(false);
    this.changeDetectorRef.detectChanges();
  }

  onPageChange(event: any) {
    if (event) {
      this.page = event;
    }
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
      this.api.execApi('Chat', 'get-book-conversations', 'GET', null, obj, true)
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
  }
}

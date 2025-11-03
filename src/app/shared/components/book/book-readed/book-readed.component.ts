import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontalOutline,
  bookOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { Book, ReadBook } from 'src/app/models/Book.model';
import { ApiService } from 'src/app/core/services/api.service';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/core/base/base.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { HeaderComponent } from 'src/app/layout/header/header.component';

interface BookReaded {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  image: string;
  issue?: string;
}

@Component({
  selector: 'app-book-readed',
  templateUrl: './book-readed.component.html',
  styleUrls: ['./book-readed.component.scss'],
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    IonList,
    HeaderComponent,
    IonSegment,
    IonSegmentButton 
  ],
  standalone: true,
})
export class BookReadedComponent extends BaseComponent {
  booksReaded: ReadBook[] = [];
  filteredBooks: ReadBook[] = [];
  totalPages: number = 1;
  selectedBookType: number = 0; // 0 = All

  // infinite scroll state
  isLoading = false;
  isEnd = false;
  readonly pageSize = 20;
  lstData: any;
  isLoad: any = true;
  pageNum: any = 1;

  bookTypes :any;
  constructor(injector: Injector) {
    super(injector);
    addIcons({
      chevronBackOutline,
      ellipsisHorizontalOutline,
      bookOutline,
    });
  }

  ngOnInit() {
    //this.getBookTypes();
    //this.loadItem();
  }

  ionViewWillEnter() {
    this.getBookTypes();
  }

  private getBookTypes() {
    this.api
      .execApi('Book', 'get-types', 'GET', null, null)
      .subscribe((result: any) => {
        this.bookTypes = result?.Data || [];
        console.log(this.bookTypes);
        if (!this.bookTypes.length) this.sampleBookTypes();
        if (this.bookTypes && this.bookTypes?.length) {
          // let first = this.bookTypes[0];
          // this.selectedBookType = first?.BookTypeId;
          this.loadItem();
        }
        //this.fetchPage(1);
      });
  }

  private fetchPage(page: number) {
    // this.isLoading = true;
    // this.apiService
    //   .execApi(
    //     'ReadBook',
    //     'get-paging',
    //     'GET',
    //     null,
    //     {
    //       PageNumber: page,
    //       PageSize: this.pageSize,
    //     },
    //     true
    //   )
    //   .subscribe(
    //     (result: any) => {
    //       const data: Book[] = result?.Data || [];
    //       this.totalPages = result?.TotalPages ?? this.totalPages;
    //       this.pageNum = result?.PageNumber ?? page;
    //       // merge
    //       this.booksReaded = page === 1 ? data : [...this.booksReaded, ...data];
    //       this.isEnd =
    //         this.pageNum >= this.totalPages || data.length < this.pageSize;
    //       this.filterBooks();
    //       this.isLoading = false;
    //       this.changeDetectorRef.detectChanges();
    //       if (this.booksReaded.length === 0) this.sampleBooksReaded();
    //     },
    //     () => {
    //       this.isLoading = false;
    //       this.changeDetectorRef.detectChanges();
    //     }
    //   );
  }

  loadMore(ev: any) {
    // if (this.isLoading || this.isEnd) {
    //   ev?.target?.complete?.();
    //   return;
    // }
    // const next = this.pageNum + 1;
    // this.fetchPage(next);
    // // complete after fetchPage updates; add small delay to ensure UI completes
    // setTimeout(() => ev?.target?.complete?.(), 300);
  }

  loadItem(isScroll: any = false): Promise<any> {
    return new Promise(async (resolve) => {
      if (!this.isLoad) resolve(false);
      let obj = {
        PageNumber: this.pageNum,
      };
      let result = await firstValueFrom(
        this.api.execApi('ReadBook', 'get-paging', 'GET', null, obj, !isScroll)
      );
      if (result && result?.Data && result?.Data?.length) {
        if (!this.lstData) this.lstData = [];
        if (!isScroll) this.lstData = result?.Data;
        else this.lstData = [...this.lstData, ...result?.Data];
        console.log(this.lstData);
        let totalRecord = result?.TotalRecords;
        if (this.lstData?.length == totalRecord) this.isLoad = false;
        this.changeDetectorRef.detectChanges();
      }
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

  onSegmentChange(event: any) {
    this.selectedBookType = parseInt(event.detail.value);
    this.filterBooks();
  }

  filterBooks() {
    if (this.selectedBookType === 0) {
      this.filteredBooks = this.booksReaded;
    } else {
      this.filteredBooks = this.booksReaded.filter(
        (item) => item.Book.BookType === this.selectedBookType
      );
    }
  }

  sampleBookTypes() {
    this.bookTypes = [
      { BookTypeId: 0, Title: 'Tất cả', IsActive: true },
      { BookTypeId: 1, Title: 'Tạp Chí Xưa và Nay', IsActive: true },
      { BookTypeId: 2, Title: 'Tập san Sử Địa', IsActive: true },
      { BookTypeId: 3, Title: 'E-Books', IsActive: true },
    ];
  }

  sampleBooksReaded() {
    this.filterBooks();
  }

  onBookClick(item: any) {
    let queryParams = null;
    if (item?.CurrentPage != undefined)
      queryParams = { page: item?.CurrentPage };
    if (item?.Book?.BookId != undefined) {
      this.router.navigate(['/book-content', item?.Book?.BookId], {
        queryParams: queryParams,
      });
    }
  }

  goBack() {
    history.back();
  }

  trackByBookId(index: number, book: Book): string {
    return book.BookId;
  }

  getBookTitle(bookTypeId: any): any {
    if (this.bookTypes && this.bookTypes?.length) {
      let data = this.bookTypes.find((x: any) => x.BookTypeId === bookTypeId);
      if (data) return data?.Title;
      return '';
    }
  }
}

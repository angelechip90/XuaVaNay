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
import { Book } from 'src/app/models/Book.model';
import { ApiService } from 'src/app/core/services/api.service';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/core/base/base.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';

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
    CommonModule,
    IonList,
  ],
  standalone: true,
})
export class BookReadedComponent extends BaseComponent {
  booksReaded: Book[] = [];
  filteredBooks: Book[] = [];
  totalPages: number = 1;
  selectedBookType: number = 0; // 0 = All

  // infinite scroll state
  isLoading = false;
  isEnd = false;
  readonly pageSize = 20;
  lstData:any;
  isLoad:any = true;
  pageNum: any = 1;

  bookTypes = [
    { BookTypeId: 0, Title: 'Tất cả', IsActive: true },
    { BookTypeId: 1, Title: 'Tạp Chí Xưa và Nay', IsActive: true },
    { BookTypeId: 2, Title: 'Tập san Sử Địa', IsActive: true },
    { BookTypeId: 3, Title: 'E-Books', IsActive: true },
  ];

  constructor(
    injector: Injector
  ) {
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
        if (!this.bookTypes.length) this.sampleBookTypes();
        if(this.bookTypes && this.bookTypes?.length){
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
    return new Promise(async resolve => {
      if (!this.isLoad) resolve(false);
      let obj = {
        PageNumber: this.pageNum,
      }
      let result = await firstValueFrom(this.api.execApi('ReadBook', 'get-paging', 'GET', null, obj, !isScroll));
      if (result && result?.Data && result?.Data?.length) {
        if (!this.lstData) this.lstData = [];
        if (!isScroll)
          this.lstData = result?.Data;
        else
          this.lstData = [...this.lstData, ...result?.Data];
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
        (book) => book.BookType === this.selectedBookType
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
    this.booksReaded = [
      {
        BookId: '1',
        Title: 'Tạp chí Xưa và Nay - Số 1',
        AvatarPath: '../../../assets/imgs/demo/1.png',
        BookTypeAsString: 'Tạp Chí Xưa và Nay',
        Description: 'Tạp chí nghiên cứu lịch sử và văn hóa',
        Slug: 'tap-chi-xua-va-nay-1',
        FileName: 'tap-chi-1.pdf',
        Link: '../../../assets/imgs/demo/1.png',
        ExternalId: 1,
        ExternalEncryptId: '1',
        TotalPage: 100,
        PublicationYear: 2020,
        Summary: 'Tạp chí Xưa và Nay',
        BookType: 1,
        CreatedDate: '2020-01-01',
      },
      {
        BookId: '2',
        Title: 'Tạp chí Xưa và Nay - Số 2',
        AvatarPath: '../../../assets/imgs/demo/2.png',
        BookTypeAsString: 'Tạp Chí Xưa và Nay',
        Description: 'Tạp chí nghiên cứu lịch sử và văn hóa',
        Slug: 'tap-chi-xua-va-nay-2',
        FileName: 'tap-chi-2.pdf',
        Link: '../../../assets/imgs/demo/2.png',
        ExternalId: 2,
        ExternalEncryptId: '2',
        TotalPage: 120,
        PublicationYear: 2021,
        Summary: 'Tạp chí Xưa và Nay số 2',
        BookType: 1,
        CreatedDate: '2021-01-01',
      },
      {
        BookId: '3',
        Title: 'Tập san Sử Địa - Số 1',
        AvatarPath: '../../../assets/imgs/demo/3.png',
        BookTypeAsString: 'Tập san Sử Địa',
        Description: 'Tập san chuyên về sử địa Việt Nam',
        Slug: 'tap-san-su-dia-1',
        FileName: 'su-dia-1.pdf',
        Link: '../../../assets/imgs/demo/3.png',
        ExternalId: 3,
        ExternalEncryptId: '3',
        TotalPage: 150,
        PublicationYear: 2020,
        Summary: 'Tập san Sử Địa',
        BookType: 2,
        CreatedDate: '2020-06-01',
      },
      {
        BookId: '4',
        Title: 'Tập san Sử Địa - Số 2',
        AvatarPath: '../../../assets/imgs/demo/4.png',
        BookTypeAsString: 'Tập san Sử Địa',
        Description: 'Tập san chuyên về sử địa Việt Nam',
        Slug: 'tap-san-su-dia-2',
        FileName: 'su-dia-2.pdf',
        Link: '../../../assets/imgs/demo/4.png',
        ExternalId: 4,
        ExternalEncryptId: '4',
        TotalPage: 140,
        PublicationYear: 2021,
        Summary: 'Tập san Sử Địa số 2',
        BookType: 2,
        CreatedDate: '2021-06-01',
      },
      {
        BookId: '5',
        Title: 'Lịch sử Việt Nam',
        AvatarPath: '../../../assets/imgs/demo/5.png',
        BookTypeAsString: 'E-Books',
        Description: 'Sách điện tử về lịch sử Việt Nam',
        Slug: 'lich-su-viet-nam',
        FileName: 'lich-su-viet-nam.pdf',
        Link: '../../../assets/imgs/demo/5.png',
        ExternalId: 5,
        ExternalEncryptId: '5',
        TotalPage: 300,
        PublicationYear: 2022,
        Summary: 'E-Book Lịch sử Việt Nam',
        BookType: 3,
        CreatedDate: '2022-01-01',
      },
      {
        BookId: '6',
        Title: 'Văn hóa Việt Nam',
        AvatarPath: '../../../assets/imgs/demo/6.png',
        BookTypeAsString: 'E-Books',
        Description: 'Sách điện tử về văn hóa Việt Nam',
        Slug: 'van-hoa-viet-nam',
        FileName: 'van-hoa-viet-nam.pdf',
        Link: '../../../assets/imgs/demo/1.png',
        ExternalId: 6,
        ExternalEncryptId: '6',
        TotalPage: 250,
        PublicationYear: 2022,
        Summary: 'E-Book Văn hóa Việt Nam',
        BookType: 3,
        CreatedDate: '2022-03-01',
      },
    ];
    this.filterBooks();
  }

  onBookClick(item: any) {
    let queryParams = null;
    if (item?.CurrentPage != undefined) queryParams = { page: item?.CurrentPage };
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
    if(this.bookTypes && this.bookTypes?.length){
      let data = this.bookTypes.find((x:any) => x.BookTypeId === bookTypeId);
      if(data) return data?.Title;
      return '';
    }
  }
}

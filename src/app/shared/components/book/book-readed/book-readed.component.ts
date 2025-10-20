import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  ],
  standalone: true,
})
export class BookReadedComponent implements OnInit {
  booksReaded: ReadBook[] = [];
  filteredBooks: ReadBook[] = [];
  totalPages: number = 1;
  pageNum: number = 1;
  selectedBookType: number = 0; // 0 = All

  // infinite scroll state
  isLoading = false;
  isEnd = false;
  readonly pageSize = 20;

  bookTypes = [
    { BookTypeId: 0, Title: 'Tất cả', IsActive: true },
    { BookTypeId: 1, Title: 'Tạp Chí Xưa và Nay', IsActive: true },
    { BookTypeId: 2, Title: 'Tập san Sử Địa', IsActive: true },
    { BookTypeId: 3, Title: 'E-Books', IsActive: true },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontalOutline,
      bookOutline,
    });
  }

  ngOnInit() {
    this.getBookTypes();
  }

  private getBookTypes() {
    this.apiService
      .execApi('Book', 'get-types', 'GET', null, null)
      .subscribe((result: any) => {
        this.bookTypes = result?.Data || [];
        this.fetchPage(1);
      });
  }

  private fetchPage(page: number) {
    this.isLoading = true;
    this.apiService
      .execApi(
        'ReadBook',
        'get-paging',
        'GET',
        null,
        {
          PageNumber: page,
          PageSize: this.pageSize,
        },
        true
      )
      .subscribe(
        (result: any) => {
          const data: ReadBook[] = result?.Data || [];
          this.totalPages = result?.TotalPages ?? this.totalPages;
          this.pageNum = result?.PageNumber ?? page;

          // merge
          this.booksReaded = page === 1 ? data : [...this.booksReaded, ...data];
          this.isEnd =
            this.pageNum >= this.totalPages || data.length < this.pageSize;

          this.filterBooks();
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
        () => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }
      );
  }

  loadMore(ev: any) {
    if (this.isLoading || this.isEnd) {
      ev?.target?.complete?.();
      return;
    }
    const next = this.pageNum + 1;
    this.fetchPage(next);
    // complete after fetchPage updates; add small delay to ensure UI completes
    setTimeout(() => ev?.target?.complete?.(), 300);
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

  onBookClick(book: Book) {
    console.log('Book selected:', book);
    this.router.navigate(['/book-detail', book.BookId]);
  }

  goBack() {
    history.back();
  }

  trackByBookId(index: number, book: Book): string {
    return book.BookId;
  }
}

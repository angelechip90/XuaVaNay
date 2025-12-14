import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonImg,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  ActionSheetController,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  searchOutline,
  optionsOutline,
  chevronDownOutline,
  bookmarkOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BASE_IMPORTS } from 'src/app/core/base/base-imports';
import { DateHeaderComponent } from 'src/app/layout/date-header/date-header.component';

export interface PosterItem {
  id: number;
  src: string;
  title?: string;
  [key: string]: any; // Allow additional properties
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [...BASE_IMPORTS, IonImg, SearchBoxComponent, DateHeaderComponent],
  standalone: true,
})
export class ListComponent extends BaseComponent {
  @Input() items: PosterItem[] = [];
  @Input() title: string = 'Xưa và Nay';
  @Input() year: any = null;
  @Input() showSearchBox: boolean = true;
  @Input() showYearFilter: boolean = true;
  @Input() bookTypeID: any = 1;

  @Output() itemClick = new EventEmitter<PosterItem>();
  @Output() bookmarkClick = new EventEmitter<PosterItem>();
  @Output() searchInput = new EventEmitter<string>();
  @Output() yearChange = new EventEmitter<any>();
  @Output() askClick = new EventEmitter<void>();

  query = '';
  method: any = '';
  lstData: any;
  isLoad: any = true;
  pageNum: any = 1;
  isLoadYear: any = false;
  yearOptions: any;

  constructor(
    injector: Injector,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService
  ) {
    super(injector);
    addIcons({
      addOutline,
      searchOutline,
      optionsOutline,
      chevronDownOutline,
      bookmarkOutline,
      arrowForwardOutline,
    });
  }

  ngOnInit() {
    // this.year = null;
    // this.loadItem();
  }

  onWillEnter() {
    this.year = null;
    this.lstData = null;
    this.yearOptions = null;
    this.isLoadYear = false;
    this.pageNum = 1;
    this.isLoad = true;
    this.loadYear();
    this.loadItem();
  }

  async loadYear() {
    let result = await firstValueFrom(
      this.api.execApi(
        'Book',
        `get-filter-year/${this.bookTypeID}`,
        'GET',
        null,
        null
      )
    );
    if (result && result?.Data && result?.Data?.length) {
      this.yearOptions = result?.Data;
      this.yearOptions.unshift('');
      this.isLoadYear = true;
    }
  }

  loadItem(isScroll: any = false): Promise<any> {
    return new Promise(async (resolve) => {
      if (!this.isLoad) {
        resolve(false);
        return;
      }
      let obj: any = {
        BookType: this.bookTypeID,
        PageNumber: this.pageNum,
        SortYearDesc: true,
      };
      if (this.year != undefined) obj['Year'] = this.year;
      let result = await firstValueFrom(
        this.api.execApi('Book', 'get-paging', 'GET', null, obj)
      );
      if (result && result?.Data && result?.Data?.length) {
        if (!this.lstData) this.lstData = [];
        if (!isScroll) this.lstData = result?.Data;
        else this.lstData = [...this.lstData, ...result?.Data];
        let totalRecord = result?.TotalRecords;
        if (this.lstData?.length >= totalRecord) {
          this.isLoad = false;
        }
        this.changeDetectorRef.detectChanges();
        resolve(true);
      } else {
        if (!isScroll) {
          this.lstData = [];
        }
        this.isLoad = false;
        this.changeDetectorRef.detectChanges();
        resolve(false);
      }
    });
  }

  async onIonInfinite(event: any) {
    console.log(
      'onIonInfinite called, isLoad:',
      this.isLoad,
      'pageNum:',
      this.pageNum
    );
    if (this.isLoad) {
      this.pageNum = this.pageNum + 1;
      await this.loadItem(true);
    }
    // Luôn gọi complete() để tránh infinite scroll bị kẹt
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 200);
  }

  onSendMessage(message: string) {
    this.query = message;
    this.searchInput.emit(message);
    this.navCtrl.navigateForward('chat', {
      queryParams: {
        message: message,
      },
    });
  }

  async chooseYear() {
    if (this.yearOptions && this.yearOptions?.length) {
      const years = this.yearOptions;
      const buttons: any[] = years.map((y: any) => ({
        text: this.translate.instant('list.yearOption', { year: y }),
        handler: () => {
          this.year = y;
          this.yearChange.emit(y);
          this.pageNum = 1;
          this.isLoad = true;
          this.loadItem();
          return true;
        },
      }));
      buttons.push({
        text: this.translate.instant('list.cancel'),
        role: 'cancel',
      });
      const sheet = await this.actionSheetCtrl.create({
        header: this.translate.instant('list.chooseYear'),
        buttons,
      });
      await sheet.present();
    }
  }

  ask() {
    this.askClick.emit();
    this.navCtrl.navigateForward('chat');
  }

  bookmark(item: PosterItem) {
    this.bookmarkClick.emit(item);
  }

  onItemClick(item: any) {
    console.log(item);
    //this.itemClick.emit(item);
    this.router.navigate(['/book-detail', item?.BookId]);
  }

  // TrackBy function để tối ưu performance
  trackByFn(index: number, item: PosterItem): number {
    return item.id;
  }

  // Xử lý lỗi khi load ảnh
  onImageError(event: any) {
    console.warn('Image load error:', event);
    // Có thể set placeholder image hoặc ẩn element
    if (event.target) {
      event.target.style.display = 'none';
    }
  }

  // Xử lý khi ảnh load thành công
  onImageLoad(event: any) {
    // Ảnh đã load thành công
    if (event.target) {
      event.target.style.display = 'block';
    }
  }
}

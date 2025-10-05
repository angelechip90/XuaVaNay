import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  searchOutline,
  optionsOutline,
  chevronDownOutline,
  bookmarkOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom } from 'rxjs';

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
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    FormsModule,
    SearchBoxComponent
  ],
  standalone: true
})
export class ListComponent extends BaseComponent{
  @Input() items: PosterItem[] = [];
  @Input() title: string = 'Xưa và Nay';
  @Input() year: number = 2025;
  @Input() showSearchBox: boolean = true;
  @Input() showYearFilter: boolean = true;
  @Input() bookTypeID: any = 1;

  @Output() itemClick = new EventEmitter<PosterItem>();
  @Output() bookmarkClick = new EventEmitter<PosterItem>();
  @Output() searchInput = new EventEmitter<string>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() askClick = new EventEmitter<void>();

  query = '';
  method:any = '';
  lstData:any;
  isLoad:any = true;
  pageNum: any = 1;

  constructor(
    injector: Injector,
    private actionSheetCtrl: ActionSheetController
  ) {
    super(injector);
    addIcons({
      addOutline,
      searchOutline,
      optionsOutline,
      chevronDownOutline,
      bookmarkOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() { 
    this.loadItem();
  }

  loadItem(isScroll:any = false) : Promise<any>{
    return new Promise(async resolve => {
      if (!this.isLoad) resolve(false);
      let obj = {
        BookType:this.bookTypeID,
        Year:this.year,
        PageNumber:this.pageNum,
      }
      let result = await firstValueFrom(this.api.execApi('Book', 'get-paging','GET', null,obj, !isScroll));
      if(result && result?.Data && result?.Data?.length){
        if (!this.lstData) this.lstData = [];
        if (!isScroll)
          this.lstData = result?.Data;
        else
          this.lstData = [...this.lstData, ...result?.Data];
        let totalRecord = result?.TotalRecords;
        if(this.lstData?.length == totalRecord) this.isLoad = false;
        this.changeDetectorRef.detectChanges();
      }
      console.log(result);
    });
  }

  async onIonInfinite(event: any) {
    if(this.isLoad){
      this.pageNum = this.pageNum + 1;
      await this.loadItem(true);
      setTimeout(() => {
        (event as InfiniteScrollCustomEvent).target.complete();
      }, 200);
    }
  }

  onSearchInput(query: string) {
    this.query = query;
    this.searchInput.emit(query);
  }

  async chooseYear() {
    const years = [2025, 2024, 2023, 2022, 2021];
    const buttons: any[] = years.map((y) => ({
      text: `Năm ${y}`,
      handler: () => {
        this.year = y;
        this.yearChange.emit(y);
        return true;
      },
    }));
    buttons.push({ text: 'Hủy', role: 'cancel' });
    const sheet = await this.actionSheetCtrl.create({
      header: 'Chọn năm',
      buttons,
    });
    await sheet.present();
  }

  ask() {
    this.askClick.emit();
  }

  bookmark(item: PosterItem) {
    this.bookmarkClick.emit(item);
  }

  onItemClick(item: PosterItem) {
    this.itemClick.emit(item);
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

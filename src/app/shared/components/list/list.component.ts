import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonImg,
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
    IonImg,
    CommonModule,
    FormsModule,
    SearchBoxComponent
],
  standalone: true
})
export class ListComponent implements OnInit {
  @Input() items: PosterItem[] = [];
  @Input() title: string = 'Xưa và Nay';
  @Input() year: number = 2025;
  @Input() showSearchBox: boolean = true;
  @Input() showYearFilter: boolean = true;

  @Output() itemClick = new EventEmitter<PosterItem>();
  @Output() bookmarkClick = new EventEmitter<PosterItem>();
  @Output() searchInput = new EventEmitter<string>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() askClick = new EventEmitter<void>();

  query = '';

  constructor(private actionSheetCtrl: ActionSheetController) {
    addIcons({
      addOutline,
      searchOutline,
      optionsOutline,
      chevronDownOutline,
      bookmarkOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() { }

  onValueChange(query: string) {
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

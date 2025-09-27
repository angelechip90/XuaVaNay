import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  searchOutline,
  optionsOutline,
  chevronDownOutline,
  bookmarkOutline
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
    IonGrid,
    IonRow,
    IonCol,
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
      bookmarkOutline
    });
  }

  ngOnInit() { }

  get leftItems() {
    return this.items.filter((_, i) => i % 2 === 0);
  }

  get rightItems() {
    return this.items.filter((_, i) => i % 2 === 1);
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
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonText,
  IonList,
  IonLabel,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  sparklesOutline,
  libraryOutline,
  newspaperOutline,
  bookOutline,
  imagesOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonText,
    IonList,
    IonLabel,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule,
    HeaderComponent,
    SectionLogoComponent,
    SearchBoxComponent
  ]
})
export class HomePage implements OnInit {
  query = '';

  constructor() {
    addIcons({
      searchOutline,
      sparklesOutline,
      libraryOutline,
      newspaperOutline,
      bookOutline,
      imagesOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
  }

  onSearchInput(ev: CustomEvent) {
    const value = (ev.detail as any)?.value ?? '';
    this.query = value;
    // TODO: gọi API / điều hướng sang trang kết quả
    // console.log('search:', this.query);
  }

  onSuggestClick() {
    // TODO: mở sheet gợi ý / prompt mẫu
    // console.log('open suggestions');
  }

  navTo(tab: string) {
    // Footer tĩnh: bạn có thể dùng Router để điều hướng nếu đã có route
    // this.router.navigateByUrl(`/tabs/${tab}`);
  }
}

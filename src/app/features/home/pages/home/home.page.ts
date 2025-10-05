import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonText,
  IonList,
  IonLabel,
  IonIcon,
  IonItem
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
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { SearchBoxComponent } from 'src/app/shared/components/search-box/search-box.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonText,
    IonList,
    IonLabel,
    IonIcon,
    IonItem,
    CommonModule,
    FormsModule,
    SectionLogoComponent,
    SearchBoxComponent
]
})
export class HomePage implements OnInit {
  query = '';

  constructor(private router: Router) {
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

  onValueChange(query: string) {
    this.query = query;
    // TODO: gọi API / điều hướng sang trang kết quả
    // console.log('search:', this.query);
  }

  onSendMessage(message: string) {
   this.router.navigateByUrl(`/chat`);
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

import { Component, OnInit, QueryList, signal, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  listOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    CommonModule
  ],
  standalone: true
})
export class BookContentComponent implements OnInit, AfterViewInit {

  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren('pageEl') pageEls!: QueryList<HTMLElement>;

  // Demo pages (gắn ảnh thật của bạn vào đây)
  pages: string[] = [
    '../../../assets/imgs/demo/1.png',
    '../../../assets/imgs/demo/2.png',
    '../../../assets/imgs/demo/3.png',
    '../../../assets/imgs/demo/4.png',
    '../../../assets/imgs/demo/5.png',
    '../../../assets/imgs/demo/6.png',
    '../../../assets/imgs/demo/7.png',
    '../../../assets/imgs/demo/8.png',
  ];

  // Giả định tổng 25 trang theo mockup (có thể = pages.length nếu đã đủ)
  totalPages = 25;

  // Trang hiện hành (mockup là 10/25)
  current = signal(10);
  id = '562';

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      listOutline,
      chevronForwardOutline
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => this.scrollTo(this.current()), 0);
  }

  goBack() { history.back(); }

  chat() {
    this.router.navigate(['/chat-in-book', this.id]);
  }

  scrollTo(n: number) {
    const idx = Math.max(1, Math.min(n, this.totalPages));
    this.current.set(idx);
    const el = document.getElementById(`page-${idx}`);
    if (el) {
      // cuộn mượt tới ảnh tương ứng
      const y = el.getBoundingClientRect().top + (document.scrollingElement?.scrollTop || 0) - 80;
      this.content.scrollToPoint(0, y, 350);
    }
  }

  prev() { this.scrollTo(this.current() - 1); }
  next() { this.scrollTo(this.current() + 1); }

  openToc() { /* TODO: mở mục lục */ }
  toggleView() { /* TODO: đổi chế độ xem (fit width/height) */ }
  more() { /* TODO: menu phụ */ }
}

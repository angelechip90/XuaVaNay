import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontalOutline,
  bookOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';

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
    CommonModule
  ],
  standalone: true
})
export class BookReadedComponent implements OnInit {

  booksReaded: BookReaded[] = [];

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontalOutline,
      bookOutline
    });
  }

  ngOnInit() {
    this.loadBooksReaded();
  }

  loadBooksReaded() {
    this.booksReaded = [
      {
        id: '1',
        title: 'XƯA & NAY SỐ 559 XUÂN GIÁP THÌN',
        description: 'Lịch sử Việt Nam từ khởi thủy đến Cách mạng tháng Tám 1945 - Phan Huy Lê...',
        category: 'Bộ tạp chí',
        categoryColor: 'orange-50',
        image: '../../../assets/imgs/demo/1.png',
        issue: '559'
      },
      {
        id: '2',
        title: 'XƯA & NAY SỐ 554 (THÁNG 8.2023)',
        description: 'Công lao, sự nghiệp của các chúa Nguyễn trong tiến trình lịch sử dân tộc Việt Nam...',
        category: 'Bộ tạp chí',
        categoryColor: 'orange-50',
        image: '../../../assets/imgs/demo/2.png',
        issue: '554'
      },
      {
        id: '3',
        title: 'XƯA & NAY SỐ 555 (THÁNG 9.2023)',
        description: 'Nghiên cứu về văn hóa và truyền thống dân tộc qua các thời đại...',
        category: 'Bộ tạp chí',
        categoryColor: 'orange-50',
        image: '../../../assets/imgs/demo/3.png',
        issue: '555'
      }
    ];
  }

  onBookClick(book: BookReaded) {
    console.log('Book selected:', book);
    this.router.navigate(['/book-detail', book.id]);
  }

  goBack() {
    history.back();
  }

  trackByBookId(index: number, book: BookReaded): string {
    return book.id;
  }
}

import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ebooks',
  templateUrl: './ebooks.page.html',
  styleUrls: ['./ebooks.page.scss'],
  imports: [
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonButton, 
    IonIcon,
    CommonModule
  ],
  standalone: true
})
export class EbooksPage implements OnInit {
  books = [
    {
      id: 1,
      title: 'Lịch sử Việt Nam',
      author: 'Nguyễn Văn A',
      description: 'Cuốn sách tổng hợp về lịch sử Việt Nam từ thời cổ đại đến hiện đại',
      coverImage: 'assets/imgs/book-history.jpg',
      category: 'Lịch sử',
      isPublished: true
    },
    {
      id: 2,
      title: 'Địa lý Việt Nam',
      author: 'Trần Thị B',
      description: 'Khám phá địa lý tự nhiên và kinh tế của Việt Nam',
      coverImage: 'assets/imgs/book-geography.jpg',
      category: 'Địa lý',
      isPublished: true
    },
    {
      id: 3,
      title: 'Văn hóa Việt Nam',
      author: 'Lê Văn C',
      description: 'Tìm hiểu về văn hóa truyền thống và hiện đại của Việt Nam',
      coverImage: 'assets/imgs/book-culture.jpg',
      category: 'Văn hóa',
      isPublished: true
    }
  ];

  constructor() { }

  ngOnInit() {}

  readBook(book: any) {
    console.log('Read book:', book);
  }

  downloadBook(book: any) {
    console.log('Download book:', book);
  }
}

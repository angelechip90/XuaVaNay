import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
  standalone: true
})
export class BookListComponent {
  @Input() books: any[] = [];
}

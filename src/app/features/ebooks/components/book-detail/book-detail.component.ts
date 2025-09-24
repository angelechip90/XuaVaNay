import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, CommonModule],
  standalone: true
})
export class BookDetailComponent {
  @Input() book: any;
}

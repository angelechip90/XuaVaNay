import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IonCard, IonItem, IonIcon, IonInput, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [IonCard, IonItem, IonIcon, IonInput, IonButton, CommonModule, FormsModule]
})
export class SearchBoxComponent implements OnInit {
  @Output() searchInput = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  onSearchInput(event: any) {
    const value = event.target.value;
    this.searchInput.emit(value);
  }
}

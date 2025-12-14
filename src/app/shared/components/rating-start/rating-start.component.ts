import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonGrid, IonRow, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-start',
  templateUrl: './rating-start.component.html',
  styleUrls: ['./rating-start.component.scss'],
  imports: [CommonModule, IonGrid, IonRow, IonIcon],
})
export class RatingStartComponent implements OnInit {
  @Input() max = 5; // tổng số sao
  @Input() value = 0; // số sao hiện tại
  @Input() readonly = false; // nếu true thì không cho click
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number>();
  constructor() {}

  ngOnInit() {}

  rate(star: number) {
    if (this.readonly || this.disabled) return;

    // Nếu bấm lại cùng một sao -> hủy chọn (set = 0)
    if (this.value === star) {
      this.value = 0;
    } else {
      this.value = star;
    }

    this.valueChange.emit(this.value);
  }

  getStars() {
    return Array(this.max)
      .fill(0)
      .map((_, i) => i + 1);
  }
}

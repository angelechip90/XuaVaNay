import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListComponent,
  PosterItem,
} from 'src/app/shared/components/list/list.component';

@Component({
  selector: 'app-geography',
  templateUrl: './geography.page.html',
  styleUrls: ['./geography.page.scss'],
  imports: [CommonModule, ListComponent],
  standalone: true,
})
export class GeographyPage implements OnInit {
  items: PosterItem[] = [
    { id: 1, src: '../../../assets/imgs/demo/1.png', title: 'Số 560' },
    { id: 2, src: '../../../assets/imgs/demo/2.png', title: 'Số 561' },
    { id: 3, src: '../../../assets/imgs/demo/3.png', title: 'Số 562' },
    { id: 4, src: '../../../assets/imgs/demo/4.png', title: 'Số 563' },
    { id: 5, src: '../../../assets/imgs/demo/5.png', title: 'Số 564' },
    { id: 6, src: '../../../assets/imgs/demo/6.png', title: 'Số 565' },
    { id: 7, src: '../../../assets/imgs/demo/7.png', title: 'Số 566' },
    { id: 8, src: '../../../assets/imgs/demo/8.png', title: 'Số 567' },
  ];

  constructor() {}

  ngOnInit() {}

  onItemClick(item: PosterItem) {
    // TODO: Navigate to detail page or open modal
  }

  onBookmarkClick(item: PosterItem) {
    console.log('Bookmark clicked:', item);
    // TODO: Add/remove bookmark
  }

  onSearchInput(query: string) {
    console.log('Search query:', query);
    // TODO: Filter items based on search query
  }

  onYearChange(year: number) {
    console.log('Year changed:', year);
    // TODO: Filter items based on year
  }

  onAskClick() {
    console.log('Ask button clicked');
    // TODO: Navigate to ask/chat page
  }
}

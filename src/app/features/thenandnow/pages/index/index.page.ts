import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListComponent, PosterItem } from 'src/app/shared/components/list/list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ListComponent]
})
export class IndexPage implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onItemClick(item: PosterItem) {
    console.log('Item clicked:', item);
    // TODO: Navigate to detail page or open modal
    this.router.navigate(['/book-detail', item.id]);
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

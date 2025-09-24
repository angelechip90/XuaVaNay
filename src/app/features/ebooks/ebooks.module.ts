import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EbooksRoutingModule } from './ebooks-routing.module';
import { EbooksPage } from './pages/ebooks/ebooks.page';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        EbooksRoutingModule,
        EbooksPage,
        BookDetailComponent,
        BookListComponent
    ]
})
export class EbooksModule { }

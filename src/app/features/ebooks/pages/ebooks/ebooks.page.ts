import { Component, Injector, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon,IonList,IonInfiniteScroll,IonInfiniteScrollContent,
  InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { bookOutline, downloadOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom } from 'rxjs';

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
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule
  ],
  standalone: true
})
export class EbooksPage extends BaseComponent{
  lstData:any;
  isLoad:any = true;
  pageNum: any = 1;
  constructor(
    injector: Injector,
  ) {
    super(injector);
    addIcons({
      downloadOutline,
      bookOutline
    });
  }

  ngOnInit() {
    this.loadItem();
  }
  
  loadItem(isScroll: any = false): Promise<any> {
    return new Promise(async resolve => {
      if (!this.isLoad) resolve(false);
      let obj = {
        BookType: 3,
        PageNumber: this.pageNum,
      }
      let result = await firstValueFrom(this.api.execApi('Book', 'get-paging', 'GET', null, obj, !isScroll));
      if (result && result?.Data && result?.Data?.length) {
        if (!this.lstData) this.lstData = [];
        if (!isScroll)
          this.lstData = result?.Data;
        else
          this.lstData = [...this.lstData, ...result?.Data];
        let totalRecord = result?.TotalRecords;
        if (this.lstData?.length == totalRecord) this.isLoad = false;
        this.changeDetectorRef.detectChanges();
      }
      console.log(result);
    });
  }

  async onIonInfinite(event: any) {
    if(this.isLoad){
      this.pageNum = this.pageNum + 1;
      await this.loadItem(true);
      setTimeout(() => {
        (event as InfiniteScrollCustomEvent).target.complete();
      }, 200);
    }
  }

  readBook(book: any) {
    console.log('Read book:', book);
  }

  downloadBook(book: any) {
    console.log('Download book:', book);
  }
}

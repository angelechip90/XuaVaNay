import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
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
export class HistoryPage implements OnInit {
    historyItems = [
        {
            id: 1,
            title: 'Việt Nam thời kỳ cổ đại',
            period: 'Thời kỳ cổ đại',
            description: 'Lịch sử Việt Nam từ thời kỳ cổ đại với các nền văn minh đầu tiên...',
            image: 'assets/imgs/ancient-vietnam.jpg'
        },
        {
            id: 2,
            title: 'Thời kỳ phong kiến',
            period: 'Thời kỳ phong kiến',
            description: 'Các triều đại phong kiến Việt Nam từ Đinh, Lê, Lý, Trần...',
            image: 'assets/imgs/feudal-vietnam.jpg'
        },
        {
            id: 3,
            title: 'Thời kỳ thuộc địa',
            period: 'Thời kỳ thuộc địa',
            description: 'Việt Nam dưới sự cai trị của thực dân Pháp...',
            image: 'assets/imgs/colonial-vietnam.jpg'
        }
    ];

    constructor() { }

    ngOnInit() { }

    viewDetail(item: any) {
        console.log('View detail:', item);
    }
}

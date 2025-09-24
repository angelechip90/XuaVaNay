import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-geography',
    templateUrl: './geography.page.html',
    styleUrls: ['./geography.page.scss'],
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
export class GeographyPage implements OnInit {
    geographyItems = [
        {
            id: 1,
            name: 'Hà Nội',
            type: 'city',
            description: 'Thủ đô của Việt Nam, trung tâm chính trị, văn hóa và kinh tế',
            image: 'assets/imgs/hanoi.jpg',
            coordinates: { latitude: 21.0285, longitude: 105.8542 }
        },
        {
            id: 2,
            name: 'TP. Hồ Chí Minh',
            type: 'city',
            description: 'Thành phố lớn nhất Việt Nam, trung tâm kinh tế phía Nam',
            image: 'assets/imgs/hcmc.jpg',
            coordinates: { latitude: 10.8231, longitude: 106.6297 }
        },
        {
            id: 3,
            name: 'Vịnh Hạ Long',
            type: 'landmark',
            description: 'Di sản thế giới UNESCO, một trong những kỳ quan thiên nhiên đẹp nhất',
            image: 'assets/imgs/halong.jpg',
            coordinates: { latitude: 20.9101, longitude: 107.1839 }
        }
    ];

    constructor() { }

    ngOnInit() { }

    viewDetail(item: any) {
        console.log('View geography detail:', item);
    }
}

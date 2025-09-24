import { Component, computed, Input, signal } from '@angular/core';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonChip,
    IonLabel,
    IonList,
    IonItem,
    IonThumbnail
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
    chevronBackOutline,
    ellipsisHorizontal,
    newspaperOutline,
    bookOutline,
    libraryOutline,
    appsOutline
} from 'ionicons/icons';

type Category = 'Tạp chí' | 'Sách' | 'Tập san Sử - Địa' | 'Bộ tạp chí' | 'Tất cả';

interface ReadItem {
    id: string;
    category: 'Tạp chí' | 'Bộ tạp chí' | 'Sách' | 'Tập san Sử - Địa';
    title: string;
    description: string;
    cover: string;
}

@Component({
    selector: 'app-history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss'],
    imports: [
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonIcon,
        IonTitle,
        IonContent,
        IonChip,
        IonLabel,
        IonList,
        IonItem,
        IonThumbnail,
        CommonModule
    ],
    standalone: true
})
export class HistoryListComponent {
    @Input() historyItems: any[] = [];

    categories: Category[] = ['Tất cả', 'Tạp chí', 'Sách', 'Tập san Sử - Địa'];
    selectedCategory = signal<Category>('Tất cả');

    constructor() {
        addIcons({
            chevronBackOutline,
            ellipsisHorizontal,
            newspaperOutline,
            bookOutline,
            libraryOutline,
            appsOutline
        });
    }

    items = signal<ReadItem[]>([
        {
            id: '571',
            category: 'Tạp chí',
            title: 'XƯA & NAY SỐ 571 (THÁNG 1.2025)',
            description:
                '"Kỷ nguyên mới" - một cái nhìn lịch sử - Dương Trung Quốc. Năm mươi năm nhìn về phía trước...',
            cover: 'https://placehold.co/60x80',
        },
        {
            id: '570',
            category: 'Tạp chí',
            title: 'XƯA & NAY SỐ 570 (THÁNG 12.2024)',
            description:
                'Vai trò của Đinh Tiên Hoàng trong lịch sử dựng nước, giữ nước và phục hưng dân tộc...',
            cover: 'https://placehold.co/60x80',
        },
        {
            id: '554a',
            category: 'Bộ tạp chí',
            title: 'XƯA & NAY SỐ 554 (THÁNG 8.2023)',
            description:
                'Công lao, sự nghiệp của các chúa Nguyễn trong tiến trình lịch sử dân tộc Việt Nam...',
            cover: 'https://placehold.co/60x80',
        },
        {
            id: '415',
            category: 'Tạp chí',
            title: 'XƯA & NAY SỐ 415 (THÁNG 11- 2012)',
            description:
                'Miếng trầu là đầu câu chuyện - Đào Hùng\nVũ Phạm Khải một nhà Nho chân chính...',
            cover: 'https://placehold.co/60x80',
        },
        {
            id: '559',
            category: 'Tạp chí',
            title: 'XƯA & NAY SỐ 559 XUÂN GIÁP THÌN',
            description:
                'Lịch sử Việt Nam từ khởi thủy đến Cách mạng tháng Tám 1945 - Phan Huy Lê...',
            cover: 'https://placehold.co/60x80',
        },
        {
            id: '554b',
            category: 'Bộ tạp chí',
            title: 'XƯA & NAY SỐ 554 (THÁNG 8.2023)',
            description:
                'Công lao, sự nghiệp của các chúa Nguyễn trong tiến trình lịch sử dân tộc Việt Nam...',
            cover: 'https://placehold.co/60x80',
        },
        {
            id: '554c',
            category: 'Bộ tạp chí',
            title: 'XƯA & NAY SỐ 554 (THÁNG 8.2023)',
            description:
                'Công lao, sự nghiệp của các chúa Nguyễn trong tiến trình lịch sử dân tộc Việt Nam...',
            cover: 'https://placehold.co/60x80',
        },
    ]);

    filteredItems = computed(() => {
        const cat = this.selectedCategory();
        if (cat === 'Tất cả') return this.items();
        // ánh xạ "Tập san Sử - Địa" nếu bạn có dữ liệu thực tế
        return this.items().filter((i) => i.category === cat || (cat === 'Tập san Sử - Địa' && i.category === 'Sách'));
    });

    onSelectCategory(cat: Category) {
        this.selectedCategory.set(cat);
    }

    goBack() {
        history.back();
    }

    openItem(item: ReadItem) {
        // TODO: Điều hướng đến chi tiết
        console.log('Open item', item);
    }
}

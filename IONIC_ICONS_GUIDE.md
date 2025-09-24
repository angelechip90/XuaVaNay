# Ionic Icons - Hướng dẫn sử dụng

## Vấn đề và giải pháp

### ❌ **Vấn đề:** Icon không hiển thị
```html
<ion-icon name="home-outline"></ion-icon>
```

### ✅ **Giải pháp:** Import và add icons vào component

## Cách sử dụng đúng

### 1. **Import icons trong component**
```typescript
import { addIcons } from 'ionicons';
import { homeOutline, squareOutline, globeOutline } from 'ionicons/icons';

@Component({...})
export class YourComponent {
  constructor() {
    addIcons({ 
      homeOutline,
      squareOutline, 
      globeOutline 
    });
  }
}
```

### 2. **Sử dụng trong template**
```html
<ion-icon aria-hidden="true" name="home-outline" class="tab-icon"></ion-icon>
```

### 3. **Import IonIcon component**
```typescript
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  imports: [IonIcon, ...]
})
```

## Các loại icons phổ biến

### **Outline Icons** (khuyến nghị cho tabs)
- `home-outline`
- `square-outline` 
- `globe-outline`
- `book-outline`
- `person-outline`
- `flask-outline`

### **Filled Icons**
- `home`
- `square`
- `globe`
- `book`
- `person`
- `flask`

### **Sharp Icons**
- `home-sharp`
- `square-sharp`
- `globe-sharp`

## Lưu ý quan trọng

1. **Luôn import icons** trước khi sử dụng
2. **Sử dụng addIcons()** trong constructor
3. **Thêm aria-hidden="true"** cho accessibility
4. **Thêm class** để styling
5. **Kiểm tra tên icon** trên [ionicons.com](https://ionicons.com)

## Ví dụ hoàn chỉnh

```typescript
// tabs.page.ts
import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  squareOutline, 
  globeOutline, 
  bookOutline, 
  personOutline, 
  flaskOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    addIcons({ 
      homeOutline,
      squareOutline,
      globeOutline,
      bookOutline,
      personOutline,
      flaskOutline
    });
  }
}
```

```html
<!-- tabs.page.html -->
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="tab1" href="/tabs/tab1">
      <ion-icon aria-hidden="true" name="home-outline"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

## Troubleshooting

### Icon vẫn không hiển thị?
1. Kiểm tra tên icon trên [ionicons.com](https://ionicons.com)
2. Đảm bảo đã import đúng
3. Kiểm tra console có lỗi không
4. Thử icon khác để test

### Icon hiển thị nhưng không đúng style?
1. Kiểm tra CSS class
2. Kiểm tra theme (light/dark mode)
3. Kiểm tra size và color

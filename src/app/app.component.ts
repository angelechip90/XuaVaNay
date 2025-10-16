import { Component, Injector } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BaseComponent } from './core/base/base.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent extends BaseComponent {
  constructor(injector: Injector, private translate: TranslateService) {
    super(injector);
       // 🌍 Khai báo ngôn ngữ hỗ trợ
    this.translate.addLangs(['en', 'vi']);

    // 🔸 Đặt mặc định
    this.translate.setDefaultLang('vi');

    // 🔹 Tự động load ngôn ngữ người dùng đã chọn (hoặc fallback sang 'vi')
    const savedLang = localStorage.getItem('lang') || 'vi';
    this.translate.use(savedLang);
  }

  ngOnInit() {}
}

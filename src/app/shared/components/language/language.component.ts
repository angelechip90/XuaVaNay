import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSegment, IonSegmentButton, IonLabel],
})
export class LanguageComponent implements OnInit {
  langs = ['vi', 'en'];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  get currentLang() {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }

  changeLang(lang: string | number | null | undefined) {
    if (typeof lang !== 'string' || !lang) return;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}

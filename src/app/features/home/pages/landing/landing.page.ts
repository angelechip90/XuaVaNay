import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
register();
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPage implements OnInit, AfterViewInit {
  @ViewChild('swiperEl', { static: true }) swiperEl?: ElementRef<any>;

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const el = this.swiperEl?.nativeElement as any;
    if (!el) return;

    Object.assign(el, {
      slidesPerView: 1,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { clickable: true },
    });

    el.initialize();
  }

  start(): void {
    this.router.navigateByUrl('/login');
  }
}

import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Ionic elements are web components; with CUSTOM_ELEMENTS_SCHEMA we don't need to import wrappers
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;
  @Input() templateEnd: TemplateRef<any> | null = null;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  goBack() {
    history.back();
  }
}

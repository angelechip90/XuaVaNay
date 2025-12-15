import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonTextarea,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  documentTextOutline,
  refreshOutline,
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-delete-account-request',
  templateUrl: './delete-account-request.page.html',
  styleUrls: ['./delete-account-request.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonTextarea,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SectionLogoComponent,
    IonHeader,
    IonToolbar,
    TranslateModule,
  ],
})
export class DeleteAccountRequestPage {
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      chevronBackOutline,
      documentTextOutline,
      refreshOutline,
    });
  }

  goBack() {
    this.navigationService.goBack();
  }

  async submit() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }
}

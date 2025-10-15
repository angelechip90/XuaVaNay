import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonInput,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, mailOutline } from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SectionLogoComponent,
  ],
})
export class ForgotPasswordPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private navigationService: NavigationService,
    private apiService: ApiService
  ) {
    addIcons({
      chevronBackOutline,
      mailOutline,
    });
  }

  goBack() {
    this.navigationService.goBack();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const toast = await this.toast.create({
        message: 'Vui lòng nhập email hợp lệ',
        duration: 2000,
        color: 'warning',
      });
      return toast.present();
    }
    this.apiService
      .execApi('account', 'forgot-password-email', 'POST', {
        email: this.form.value.email,
      })
      .subscribe(async (res: any) => {
        if (res.Succeeded) {
          const toast = await this.toast.create({
            message: res.Message,
            duration: 2000,
            color: 'success',
          });
          await toast.present();
        } else {
          const toast = await this.toast.create({
            message: res.Message,
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
        }
      });

    // Navigate back after success
    setTimeout(() => {
      this.navigationService.goBack();
    }, 2000);
  }
}

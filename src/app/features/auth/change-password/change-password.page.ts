import { Component, signal } from '@angular/core';
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
  IonButton,
  ToastController,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BASE_IMPORTS } from 'src/app/core/base/base-imports';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [...BASE_IMPORTS, SectionLogoComponent, IonHeader, IonToolbar],
})
export class ChangePasswordPage {
  showCurrentPw = signal(false);
  showNewPw = signal(false);
  showConfirmPw = signal(false);

  form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    addIcons({
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  passwordMatchValidator(formGroup: any) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  toggleCurrentPw() {
    this.showCurrentPw.update((v) => !v);
  }

  toggleNewPw() {
    this.showNewPw.update((v) => !v);
  }

  toggleConfirmPw() {
    this.showConfirmPw.update((v) => !v);
  }

  goBack() {
    this.navigationService.goBack();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const toast = await this.toast.create({
        message: this.translate.instant('changePassword.toast.mismatchForm'),
        duration: 2000,
        color: 'warning',
      });
      return toast.present();
    }

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      const toast = await this.toast.create({
        message: this.translate.instant('changePassword.toast.confirmNotMatch'),
        duration: 2000,
        color: 'danger',
      });
      return toast.present();
    }

    if (this.form.value.currentPassword === this.form.value.newPassword) {
      const toast = await this.toast.create({
        message: this.translate.instant('changePassword.toast.newSameOld'),
        duration: 2000,
        color: 'warning',
      });
      return toast.present();
    }

    // Simulate password change process
    const toast = await this.toast.create({
      message: this.translate.instant('changePassword.toast.success'),
      duration: 2000,
      color: 'success',
    });
    await toast.present();

    // Navigate back after success
    setTimeout(() => {
      this.navigationService.goBack();
    }, 2000);
  }
}

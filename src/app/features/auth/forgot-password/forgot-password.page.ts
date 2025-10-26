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
  ToastController,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  mailOutline,
  refreshOutline,
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { ApiService } from 'src/app/core/services/api.service';
import { generateCaptcha } from 'src/app/shared/utils/utils';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ValidationMessagePipe } from 'src/app/shared/pipes/validation-message.pipe';

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
    IonButton,
    TranslateModule,
    ValidationMessagePipe,
  ],
})
export class ForgotPasswordPage {
  captchaCode = signal(generateCaptcha());
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    captcha: [
      '',
      [Validators.required, (c: AbstractControl) => this.captchaValidator(c)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private navigationService: NavigationService,
    private apiService: ApiService,
    private translate: TranslateService
  ) {
    addIcons({
      chevronBackOutline,
      mailOutline,
      refreshOutline,
    });
  }

  goBack() {
    this.navigationService.goBack();
  }

  refreshCaptcha() {
    this.captchaCode.set(generateCaptcha());
    const c = this.form.controls.captcha;
    c.setValue('');
    c.markAsPristine();
    c.markAsUntouched();
    c.updateValueAndValidity();
  }

  captchaValidator(control: AbstractControl): ValidationErrors | null {
    const input = (control.value ?? '').toString().trim();
    if (!input) return null; // 'required' validator will handle empty values
    const expected = (this.captchaCode() ?? '').toString().trim();
    return input.toUpperCase() === expected.toUpperCase()
      ? null
      : { captchaInvalid: true };
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const messages: string[] = [];
      const controls: any = this.form.controls;
      if (controls.email.errors) {
        const label = this.translate.instant('fields.email');
        if (controls.email.errors['required']) {
          messages.push(
            this.translate.instant('validation.required', { field: label })
          );
        } else if (controls.email.errors['email']) {
          messages.push(
            this.translate.instant('validation.email', { field: label })
          );
        }
      }
      if (controls.captcha.errors) {
        const label = this.translate.instant('fields.captcha');
        if (controls.captcha.errors['required']) {
          messages.push(
            this.translate.instant('validation.required', { field: label })
          );
        } else if (controls.captcha.errors['captchaInvalid']) {
          messages.push(this.translate.instant('validation.captchaInvalid'));
        }
      }
      const unique = Array.from(new Set(messages))
        .map((m) => `• ${m}`)
        .join('\n');
      const toast = await this.toast.create({
        message: unique || this.translate.instant('common.errorTryAgain'),
        duration: 2500,
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
  }
}

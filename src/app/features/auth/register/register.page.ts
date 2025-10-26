import { Component, Injector, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonCheckbox,
  IonHeader,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  shieldCheckmarkOutline,
  refreshOutline,
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { BaseComponent } from 'src/app/core/base/base.component';
import { firstValueFrom } from 'rxjs';
import { generateCaptcha } from 'src/app/shared/utils/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonCheckbox,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SectionLogoComponent,
  ],
})
export class RegisterPage extends BaseComponent {
  showPw = false;
  showPw2 = false;
  captchaCode = signal(generateCaptcha());

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
      captcha: [
        '',
        [Validators.required, (c: AbstractControl) => this.captchaValidator(c)],
      ],
      policy: [false, [Validators.requiredTrue]],
    },
    { validators: this.passwordMatchValidator }
  );

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private toast: ToastController,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    super(injector);
    addIcons({
      chevronBackOutline,
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      shieldCheckmarkOutline,
      refreshOutline,
    });
  }

  ngOnInit() {
    this.refreshCaptcha();
  }

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  captchaValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = (control.value || '').toString().trim().toUpperCase();
    if (!value) return null;
    const code = (this.captchaCode() || '').toString().trim().toUpperCase();
    return value === code ? null : { captchaInvalid: true };
  }

  private collectValidationErrorMessages(): string[] {
    const messages: string[] = [];

    if (this.form.errors?.['mismatch']) {
      messages.push(this.translate.instant('validation.mismatch'));
    }

    const controls: Record<string, any> = this.form.controls as any;
    Object.keys(controls).forEach((key) => {
      const control = controls[key];
      const errors: ValidationErrors | null = control?.errors || null;
      if (!errors) return;
      const firstKey = Object.keys(errors)[0];
      const errVal: any = (errors as any)[firstKey];
      const fieldLabel = this.translate.instant(`fields.${key}`);

      switch (firstKey) {
        case 'required':
          messages.push(
            this.translate.instant('validation.required', { field: fieldLabel })
          );
          break;
        case 'email':
          messages.push(
            this.translate.instant('validation.email', { field: fieldLabel })
          );
          break;
        case 'minlength':
          messages.push(
            this.translate.instant('validation.minlength', {
              field: fieldLabel,
              length: errVal?.requiredLength,
            })
          );
          break;
        case 'maxlength':
          messages.push(
            this.translate.instant('validation.maxlength', {
              field: fieldLabel,
              length: errVal?.requiredLength,
            })
          );
          break;
        case 'pattern':
          messages.push(
            this.translate.instant('validation.pattern', { field: fieldLabel })
          );
          break;
        case 'requiredTrue':
          messages.push(this.translate.instant('validation.requiredTrue'));
          break;
        case 'captchaInvalid':
          messages.push(this.translate.instant('validation.captchaInvalid'));
          break;
        default:
          messages.push(this.translate.instant('validation.default'));
      }
    });

    return Array.from(new Set(messages));
  }

  togglePw() {
    this.showPw = !this.showPw;
  }

  togglePw2() {
    this.showPw2 = !this.showPw2;
  }

  refreshCaptcha() {
    this.captchaCode.set(generateCaptcha());
    const c = this.form.controls.captcha;
    c.setValue('');
    c.markAsPristine();
    c.markAsUntouched();
    c.updateValueAndValidity();
  }

  goLogin() {
    this.navigationService.navigateToLogin();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const messages = this.collectValidationErrorMessages().map(
        (m) => `• ${m}`
      );
      const toast = await this.toast.create({
        message: messages.join('\n'),
        duration: 3000,
        color: 'warning',
      });
      return toast.present();
    }

    if (this.form.value.password !== this.form.value.confirm) {
      const toast = await this.toast.create({
        message: 'Mật khẩu xác nhận không khớp',
        duration: 2000,
        color: 'danger',
      });
      return toast.present();
    }

    if (!this.form.value.policy) {
      const toast = await this.toast.create({
        message: 'Bạn cần đồng ý chính sách để tiếp tục',
        duration: 2000,
        color: 'warning',
      });
      return toast.present();
    }

    var obj = {
      FullName: this.form.value.name,
      Email: this.form.value.email,
      Password: this.form.value.password,
      ConfirmPassword: this.form.value.confirm,
      // Captcha: this.form.value.captcha,
    };

    let result = await firstValueFrom(
      this.api.execApi('account', 'register-email', 'POST', obj)
    );
    if (result && result?.Succeeded) {
      // Simulate registration process
      const toast = await this.toast.create({
        message: result.Message,
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } else {
      const toast = await this.toast.create({
        message: result?.Message,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }

    // Navigate to login after success
    setTimeout(() => {
      this.navigationService.navigateToLogin();
    }, 2000);
  }
}

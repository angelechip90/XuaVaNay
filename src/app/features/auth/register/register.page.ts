import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonCheckbox,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  refreshOutline
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';

// Custom validator for password confirmation
function matchValidator(controlName: string, matchingControlName: string) {
  return (abstractControl: AbstractControl): ValidationErrors | null => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if (matchingControl?.errors && !matchingControl.errors['mismatch']) {
      return null;
    }

    if (control?.value !== matchingControl?.value) {
      const error = { mismatch: true };
      matchingControl?.setErrors(error);
      return error;
    } else {
      matchingControl?.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonCheckbox,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SectionLogoComponent
  ]
})
export class RegisterPage implements OnInit {

  showPw = signal(false);
  showPw2 = signal(false);

  captchaUrl = signal(this.makeCaptchaUrl());

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
      captcha: ['', [Validators.required, Validators.minLength(4)]],
      policy: [false, Validators.requiredTrue],
    },
    { validators: matchValidator('password', 'confirm') }
  );

  constructor(
    private fb: FormBuilder,
    private toast: ToastController
  ) {
    addIcons({
      chevronBackOutline,
      personOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      refreshOutline
    });
  }

  ngOnInit() {
  }

  goBack() { history.back(); }

  togglePw() { this.showPw.update(v => !v); }
  togglePw2() { this.showPw2.update(v => !v); }

  makeCaptchaUrl() {
    const ts = Date.now();
    return `https://placehold.co/126x56?text=CAPTCHA&cb=${ts}`;
    // TODO: đổi thành endpoint CAPTCHA thật của bạn
  }

  refreshCaptcha() {
    this.captchaUrl.set(this.makeCaptchaUrl());
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const t = await this.toast.create({ message: 'Vui lòng kiểm tra các trường bắt buộc', duration: 1200, position: 'bottom' });
      return t.present();
    }
    // TODO: gọi API đăng ký
    const t = await this.toast.create({ message: 'Đăng ký thành công', duration: 1000, position: 'bottom' });
    t.present();
  }

  goLogin() {
    // TODO: điều hướng sang trang đăng nhập (router.navigateByUrl('/login'))
    console.log('Đi tới trang đăng nhập');
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonCheckbox,
  IonHeader,
  ToastController
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
  refreshOutline
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';

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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SectionLogoComponent
]
})
export class RegisterPage implements OnInit {
  showPw = signal(false);
  showPw2 = signal(false);
  captchaUrl = signal('');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]],
    captcha: ['', [Validators.required]],
    policy: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private navigationService: NavigationService
  ) {
    addIcons({
      chevronBackOutline,
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      shieldCheckmarkOutline,
      refreshOutline
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

  togglePw() {
    this.showPw.update(v => !v);
  }

  togglePw2() {
    this.showPw2.update(v => !v);
  }

  refreshCaptcha() {
    // Generate a simple captcha URL (you can replace with actual captcha service)
    const timestamp = Date.now();
    this.captchaUrl.set(`../../../assets/imgs/1.png?text=${timestamp.toString().slice(-4)}`);
  }

  goLogin() {
    this.navigationService.navigateToLogin();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const toast = await this.toast.create({
        message: 'Vui lòng nhập đầy đủ thông tin và đảm bảo mật khẩu khớp',
        duration: 2000,
        color: 'warning'
      });
      return toast.present();
    }

    if (this.form.value.password !== this.form.value.confirm) {
      const toast = await this.toast.create({
        message: 'Mật khẩu xác nhận không khớp',
        duration: 2000,
        color: 'danger'
      });
      return toast.present();
    }

    if (!this.form.value.policy) {
      const toast = await this.toast.create({
        message: 'Bạn cần đồng ý chính sách để tiếp tục',
        duration: 2000,
        color: 'warning'
      });
      return toast.present();
    }

    // Simulate registration process
    const toast = await this.toast.create({
      message: 'Đăng ký thành công! Vui lòng đăng nhập',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    
    // Navigate to login after success
    setTimeout(() => {
      this.navigationService.navigateToLogin();
    }, 2000);
  }
}
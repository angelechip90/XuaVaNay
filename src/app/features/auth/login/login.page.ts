import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage implements OnInit {
  showPw = signal(false);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });
  constructor(
    private fb: FormBuilder,
    private toast: ToastController
  ) {
    addIcons({
      chevronBackOutline,
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  ngOnInit() {
  }

  goBack() { history.back(); }

  togglePw() { this.showPw.update(v => !v); }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const t = await this.toast.create({ message: 'Vui lòng nhập đầy đủ thông tin', duration: 1200 });
      return t.present();
    }
    // TODO: gọi API đăng nhập của bạn
    const t = await this.toast.create({ message: 'Đăng nhập thành công', duration: 1000, position: 'bottom' });
    t.present();
  }

  forgotPw() {
    // TODO: điều hướng trang quên mật khẩu
    console.log('Forgot password');
  }

  register() {
    // TODO: điều hướng trang đăng ký
    console.log('Go to register');
  }
}

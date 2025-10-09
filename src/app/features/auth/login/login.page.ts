import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonCheckbox,
  ToastController,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    SectionLogoComponent,
  ],
})
export class LoginPage implements OnInit {
  showPw = signal(false);
  isLoading = signal(false);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private authService: AuthService,
    private loadingService: LoadingService,
    private navigationService: NavigationService
  ) {
    addIcons({
      chevronBackOutline,
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  ngOnInit() {
    // Subscribe to loading state
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  goBack() {
    this.navigationService.goBack();
  }

  togglePw() {
    this.showPw.update((v) => !v);
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.showToast('Vui lòng nhập đầy đủ thông tin', 'warning');
      return;
    }

    this.loadingService.show();

    try {
      const result = await this.authService.login(
        this.form.value.username || '',
        this.form.value.password || ''
      );

      if (result.Succeeded) {
        await this.showToast('Đăng nhập thành công', 'success');
        this.navigationService.navigateToHome();
      }
    } catch (error) {
      await this.showToast('Có lỗi xảy ra, vui lòng thử lại', 'danger');
    } finally {
      this.loadingService.hide();
    }
  }

  forgotPw() {
    this.navigationService.navigateToForgotPassword();
  }

  register() {
    this.navigationService.navigateToRegister();
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' = 'success'
  ): Promise<void> {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
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
import { LanguageComponent } from 'src/app/shared/components/language/language.component';
import { TranslateService } from '@ngx-translate/core';
import { BASE_IMPORTS } from 'src/app/core/base/base-imports';
import { IonRouterOutlet } from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [...BASE_IMPORTS, SectionLogoComponent, LanguageComponent],
})
export class LoginPage implements OnInit, OnDestroy {
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
    private navigationService: NavigationService,
    private translate: TranslateService,
    private routerOutlet: IonRouterOutlet
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
    if (this.routerOutlet) {
      this.routerOutlet.swipeGesture = false;
    }
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
      const messages: string[] = [];
      const controls: any = this.form.controls;
      if (controls.username.errors) {
        const label = this.translate.instant('fields.username');
        if (controls.username.errors['required']) {
          messages.push(
            this.translate.instant('validation.required', { field: label })
          );
        }
      }
      if (controls.password.errors) {
        const label = this.translate.instant('fields.password');
        if (controls.password.errors['required']) {
          messages.push(
            this.translate.instant('validation.required', { field: label })
          );
        } else if (controls.password.errors['minlength']) {
          messages.push(
            this.translate.instant('validation.minlength', {
              field: label,
              length: controls.password.errors['minlength'].requiredLength,
            })
          );
        }
      }
      const unique = Array.from(new Set(messages))
        .map((m) => `• ${m}`)
        .join('\n');
      await this.showToast(
        unique || this.translate.instant('login.toast.incomplete'),
        'warning'
      );
      return;
    }

    this.loadingService.show();

    try {
      const result = await this.authService.login(
        this.form.value.username || '',
        this.form.value.password || ''
      );

      if (result.Succeeded) {
        await this.showToast(
          this.translate.instant('login.toast.success'),
          'success'
        );
        this.navigationService.navigateToHome();
      }
    } catch (error) {
      await this.showToast(
        this.translate.instant('login.toast.error'),
        'danger'
      );
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
      position: 'top',
      color,
    });
    await toast.present();
  }

  ionViewWillLeave() {
    if (this.routerOutlet) {
      this.routerOutlet.swipeGesture = true;
    }
    // Optional: Re-enable side menu swipe if needed
    // this.menuController.swipeEnable(true);
  }

  ngOnDestroy() {
    if (this.routerOutlet) {
      this.routerOutlet.swipeGesture = true;
    }
  }
}

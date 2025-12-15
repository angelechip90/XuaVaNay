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
  IonIcon,
  IonInput,
  IonButton,
  ToastController,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  locationOutline,
  callOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import { SectionLogoComponent } from 'src/app/layout/section-logo/section-logo.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BASE_IMPORTS } from 'src/app/core/base/base-imports';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserInfo } from 'src/app/models/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account-info',
  templateUrl: './edit-account-info.page.html',
  styleUrls: ['./edit-account-info.page.scss'],
  standalone: true,
  imports: [...BASE_IMPORTS, SectionLogoComponent, IonHeader, IonToolbar],
})
export class EditAccountInfoPage implements OnInit {
  isLoading = signal(false);
  userInfo = signal<UserInfo>({} as UserInfo);

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    address: [''],
    phoneNumber: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private navigationService: NavigationService,
    private translate: TranslateService,
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      locationOutline,
      callOutline,
      chevronBackOutline,
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    await this.authService.getUserInfo().then((result) => {
      if (result) {
        let user = result as unknown as UserInfo;
        this.userInfo.set(user);
        this.form.patchValue({
          fullName: user.FullName || '',
          address: user.Address || '',
          phoneNumber: user.PhoneNumber || '',
        });
      }
    });
  }

  goBack() {
    this.navigationService.goBack();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const messages: string[] = [];
      const controls: any = this.form.controls;
      if (controls.fullName.errors) {
        const label = this.translate.instant('editAccount.fullName');
        if (controls.fullName.errors['required']) {
          messages.push(
            this.translate.instant('validation.required', { field: label })
          );
        }
      }
      if (controls.phoneNumber.errors) {
        const label = this.translate.instant('editAccount.phoneNumber');
        if (controls.phoneNumber.errors['pattern']) {
          messages.push(
            this.translate.instant('validation.pattern', { field: label })
          );
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

    this.isLoading.set(true);

    try {
      const updateData = {
        FullName: this.form.value.fullName,
        Address: this.form.value.address || '',
        PhoneNumber: this.form.value.phoneNumber || '',
      };

      this.api
        .execApi('Account', 'update-info', 'PUT', updateData)
        .subscribe(async (res: any) => {
          this.isLoading.set(false);
          if (res && res.Succeeded) {
            const toast = await this.toast.create({
              message:
                res.Message || this.translate.instant('editAccount.success'),
              duration: 2000,
              color: 'success',
            });
            await toast.present();
            setTimeout(() => {
              this.router.navigateByUrl('/account-info', { replaceUrl: true });
            }, 1500);
          } else {
            const toast = await this.toast.create({
              message:
                res.Message || this.translate.instant('common.errorTryAgain'),
              duration: 2000,
              color: 'danger',
            });
            await toast.present();
          }
        });
    } catch (error) {
      this.isLoading.set(false);
      const toast = await this.toast.create({
        message: this.translate.instant('common.errorTryAgain'),
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}

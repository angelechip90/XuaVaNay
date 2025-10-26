import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'validationMessage',
  standalone: true,
  pure: true,
})
export class ValidationMessagePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(control: AbstractControl | null, fieldKey: string): string | null {
    if (!control) return null;
    if (!(control.touched || control.dirty)) return null;
    if (!control.errors) return null;

    const errors: ValidationErrors = control.errors;
    const firstKey = Object.keys(errors)[0];

    switch (firstKey) {
      case 'required':
        return this.t('validation.required', { field: this.tField(fieldKey) });
      case 'email':
        return this.t('validation.email', { field: this.tField(fieldKey) });
      case 'minlength': {
        const requiredLength = errors['minlength']?.requiredLength;
        return this.t('validation.minlength', {
          field: this.tField(fieldKey),
          length: requiredLength,
        });
      }
      case 'maxlength': {
        const requiredLength = errors['maxlength']?.requiredLength;
        return this.t('validation.maxlength', {
          field: this.tField(fieldKey),
          length: requiredLength,
        });
      }
      case 'pattern':
        return this.t('validation.pattern', { field: this.tField(fieldKey) });
      case 'mismatch':
        return this.t('validation.mismatch');
      case 'requiredTrue':
        return this.t('validation.requiredTrue');
      case 'captchaInvalid':
        return this.t('validation.captchaInvalid');
      default:
        return this.t('validation.default');
    }
  }

  private t(key: string, params?: Record<string, any>): string {
    return this.translate.instant(key, params);
  }

  private tField(fieldKey: string): string {
    return this.translate.instant(`fields.${fieldKey}`);
  }
}

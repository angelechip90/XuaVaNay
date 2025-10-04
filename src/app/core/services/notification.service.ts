import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastController: ToastController) { }
  async showSuccess(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      color: 'success',
      duration: duration,
      position: 'top',
      icon: 'checkmark-circle-outline'
    });
    toast.present();
  }

  async showError(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      color: 'danger',
      duration: duration,
      position: 'top',
      icon: 'alert-circle-outline'
    });
    toast.present();
  }
}

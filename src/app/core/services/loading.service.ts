import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingElement: HTMLIonLoadingElement | null = null;

    constructor(private loadingController: LoadingController) { }

    async show(message: string = 'Đang tải...'): Promise<void> {
        if (this.loadingElement) {
            return;
        }

        this.loadingElement = await this.loadingController.create({
            message,
            spinner: 'crescent',
            translucent: true,
            backdropDismiss: false
        });

        await this.loadingElement.present();
    }

    async hide(): Promise<void> {
        if (this.loadingElement) {
            await this.loadingElement.dismiss();
            this.loadingElement = null;
        }
    }

    async showWithDuration(message: string, duration: number): Promise<void> {
        await this.show(message);
        setTimeout(() => {
            this.hide();
        }, duration);
    }
}

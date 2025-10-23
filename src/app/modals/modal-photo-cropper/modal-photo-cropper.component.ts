import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
	ImageCroppedEvent,
	LoadedImage,
	OutputFormat,
	ImageCropperComponent,
} from 'ngx-image-cropper';
import { urlToFile } from '../../utils/appFile';

@Component({
	selector: 'app-modal-photo-cropper',
	templateUrl: './modal-photo-cropper.component.html',
	styleUrls: ['./modal-photo-cropper.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		TranslateModule,
		ImageCropperComponent
	]
})
export class ModalPhotoCropperComponent implements OnInit {
	@Input() file?: File;

	private croppedImage?: string;
	public croppedImageFormat: OutputFormat = 'png';

	constructor(private modalController: ModalController) {}

	ngOnInit() {}

	close() {
		this.modalController.dismiss();
	}

	submit() {
		if (this.croppedImage) {
			urlToFile(this.croppedImage, this.croppedImageFormat, (file?: File) => {
				if (file) {
					this.modalController.dismiss(file, 'submit');
				} else {
					this.close();
				}
			});
		} else {
			this.close();
		}
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.objectUrl ?? undefined;
	}

	imageLoaded(image: LoadedImage) {
		// show cropper
	}

	cropperReady() {
		// cropper ready
	}

	loadImageFailed() {
		// show message
	}
}

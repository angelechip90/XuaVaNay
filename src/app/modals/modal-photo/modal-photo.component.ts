import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-modal-photo',
	templateUrl: './modal-photo.component.html',
	styleUrls: ['./modal-photo.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		TranslateModule
	]
})
export class ModalPhotoComponent implements OnInit {
	public platform = Capacitor.getPlatform();

	constructor(private modalController: ModalController) {}

	ngOnInit() {}

	/*ionViewDidEnter() {
		//với bản web thì mở luôn chọn ảnh, khỏi cần lựa chọn
		if (this.platform == 'web') {
			this.submit('library');
		}
	}*/

	submit(type: string) {
		this.modalController.dismiss(type, 'submit');
	}
}

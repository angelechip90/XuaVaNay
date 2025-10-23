import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { SpeechRecognition4Web } from '../../utils/SpeechRecognition';

@Component({
	selector: 'app-modal-voice',
	templateUrl: './modal-voice.component.html',
	styleUrls: ['./modal-voice.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		TranslateModule
	]
})
export class ModalVoiceComponent implements OnInit, OnDestroy, AfterViewInit {
	public isrunning?: boolean;
	public message?: string;

	private issubmit?: boolean;
	private timeoutSubmit = 5000; //ms
	private intervalTimeoutSubmit?: any;

	private platform = Capacitor.getPlatform();
	private speechRecognition: any;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private modalController: ModalController
	) {
		if (this.platform === 'web') {
			this.speechRecognition = new SpeechRecognition4Web();
		} else {
			this.speechRecognition = SpeechRecognition;
		}
	}

	ngOnInit() {
		//đăng kí nhận dữ liệu
		this.srRegister();
	}

	ngAfterViewInit() {
		//bắt đầu
		this.srStart();
	}

	ngOnDestroy() {
		//dừng lại
		this.srStop();
		this.srDispose();
	}

	modalClose() {
		this.modalController.dismiss();
	}

	modalSubmit() {
		if (!this.issubmit) {
			this.issubmit = true;
			this.modalController.dismiss(this.message, 'success');
		}
		this.srStop();
	}

	tryAgain() {
		this.message = undefined;
		this.timeoutSubmit = 5000;

		if (!this.isrunning) {
			this.srStart();
		}
	}

	private async srRegister() {
		//đăng kí nhận dữ liệu
		this.speechRecognition.removeAllListeners().then(() => {
			this.speechRecognition.addListener('partialResults', (data: any) => {
				console.log('partialResults', data.matches);

				if (data.matches?.length) {
					this.message = data.matches[0];
					this.timeoutSubmit = 3000;

					//UI nó không chịu refresh, phải dùng tạ gánh mới nổi
					this.changeDetectorRef.detectChanges();
				}
			});

			this.speechRecognition.addListener('listeningState', (data: any) => {
				console.log('listeningState', data.status);

				if (data.status == 'stoped') {
					if (this.issubmit) {
						this.issubmit = false;
					} else if (this.message) {
						this.modalSubmit();
					} else {
						this.modalClose();
					}
				}
			});
		});
	}

	private async srStart() {
		var options = {
			language: 'vi-VN',
			maxResults: 2,
			prompt: 'Gợi ý\nHãy nói địa chỉ hoặc trạm sạc bạn muốn tìm',
			partialResults: true,
			popup: false,
		};

		//bắt đầu
		this.speechRecognition
			.start(options)
			.then((value: any) => {
				console.log(value);
				this.isrunning = true;

				//interval out
				clearInterval(this.intervalTimeoutSubmit);
				this.intervalTimeoutSubmit = setInterval(() => {
					this.timeoutSubmit -= 100;
					if (this.timeoutSubmit <= 0) {
						this.modalSubmit();
						clearInterval(this.intervalTimeoutSubmit);
					}
				}, 100);
			})
			.catch((res: any) => {
				this.srStop();
			});
	}

	private async srStop() {
		if (this.isrunning) {
			await this.speechRecognition.stop();
			this.isrunning = false;
		}
	}

	private async srDispose() {
		await this.speechRecognition.removeAllListeners();
	}

	srAvailable() {
		this.speechRecognition.available().then((value: { available: any }) => {
			console.log('available', value);

			if (value.available) {
				//kiểm tra quyền truy cập
				this.srCheck();
			} else {
				//this.toastController.create({ message: "Thiết bị của bạn chưa hỗ trợ!" }).then(toast => toast.present());
			}
		});
	}

	srCheck() {
		this.speechRecognition
			.checkPermissions()
			.then((value: { speechRecognition: string }) => {
				console.log('checkPermissions', value);

				if (value.speechRecognition == 'prompt') {
					//xin quyền truy cập
					this.srRequest();
				} else if (value.speechRecognition == 'granted') {
					//bắt đầu
					this.srStart();
				} else if (value.speechRecognition == 'denied') {
					//this.toastController.create({ message: "Quyền truy cập bị từ chối!" }).then(toast => toast.present());
				}
			});
	}

	srRequest() {
		this.speechRecognition
			.requestPermissions()
			.then((value: { speechRecognition: string }) => {
				console.log('requestPermissions', value);

				if (value.speechRecognition == 'prompt') {
					//xin quyền truy cập
					this.srRequest();
				} else if (value.speechRecognition == 'granted') {
					//bắt đầu
					this.srStart();
				} else if (value.speechRecognition == 'denied') {
					//this.toastController.create({ message: "Quyền truy cập bị từ chối!" }).then(toast => toast.present());
				}
			});
	}
}

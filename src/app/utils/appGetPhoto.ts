import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ModalController, ToastController } from '@ionic/angular';
import {
	AndroidSettings,
	IOSSettings,
	NativeSettings,
} from 'capacitor-native-settings';
import { ModalPhotoComponent } from '../modals/modal-photo/modal-photo.component';
import { APP_COMPONENT_IonToast } from './appComponent';
import { urlToFile } from './appFile';

const checkCamera = (options: {
	success: Function;
	warning: Function;
	error: Function;
	setting: Function;
}) => {
	if (['ios', 'android'].includes(Capacitor.getPlatform())) {
		Camera.checkPermissions()
			.then((resCheck) => {
				if (resCheck.camera == 'granted') {
					options.success();
				} else if (resCheck.camera == 'denied') {
					options.setting('Bạn đã từ chối cho phép ứng dụng mở Camera!');
				} else if (
					resCheck.camera == 'prompt' ||
					resCheck.camera == 'prompt-with-rationale'
				) {
					Camera.requestPermissions()
						.then((resRequest) => {
							if (resRequest.camera == 'granted') {
								options.success();
							} else if (resRequest.camera == 'denied') {
								options.setting('Bạn đã từ chối cho phép ứng dụng mở Camera!');
							} else if (resCheck.camera == 'limited') {
								options.success();
							} else {
								options.warning('Something is wrong! [#1]');
							}
						})
						.catch((err) => {
							options.warning('Something is wrong! [#2]');
						});
				} else if (resCheck.camera == 'limited') {
					options.success();
				} else {
					options.warning('Something is wrong! [#4]');
				}
			})
			.catch((err) => {
				options.warning('Something is wrong! [#3]');
			});
	} else {
		options.error('Chưa hỗ trợ mở Camera ở nền tảng này!');
	}
};

const checkLibrary = (options: {
	success: Function;
	warning: Function;
	error: Function;
	setting: Function;
}) => {
	Camera.checkPermissions()
		.then((resCheck) => {
			if (resCheck.photos == 'granted') {
				options.success();
			} else if (resCheck.photos == 'denied') {
				options.setting('Bạn đã từ chối cho phép ứng dụng mở Thư viện!');
			} else if (
				resCheck.photos == 'prompt' ||
				resCheck.photos == 'prompt-with-rationale'
			) {
				Camera.requestPermissions()
					.then((resRequest) => {
						if (resRequest.photos == 'granted') {
							options.success();
						} else if (resRequest.photos == 'denied') {
							options.setting('Bạn đã từ chối cho phép ứng dụng mở Thư viện!');
						} else if (resCheck.photos == 'limited') {
							options.success();
						} else {
							options.warning('Something is wrong! [#1]');
						}
					})
					.catch((err) => {
						options.warning('Something is wrong! [#2]');
					});
			} else if (resCheck.photos == 'limited') {
				options.success();
			} else {
				options.warning('Something is wrong! [#4]');
			}
		})
		.catch((err) => {
			options.warning('Something is wrong! [#3]');
		});
};

const getCamera = (callback: Function) => {
	Camera.getPhoto({
		quality: 100,
		source: CameraSource.Camera,
		resultType: CameraResultType.DataUrl,
	})
		.then((value) => {
			if (value.dataUrl) {
				urlToFile(value.dataUrl, value.format, (file?: File) => {
					if (file) {
						callback([file]);
					}
				});
			}
		})
		.catch((err) => {
			console.error('getPhoto catch', err);
		});
};

const getLibrary = (callback: Function) => {
	Camera.getPhoto({
		quality: 100,
		source: CameraSource.Photos,
		resultType: CameraResultType.DataUrl,
	})
		.then((value) => {
			if (value.dataUrl) {
				urlToFile(value.dataUrl, value.format, (file?: File) => {
					if (file) {
						callback([file]);
					}
				});
			}
		})
		.catch((err) => {
			console.error('getPhoto catch', err);
		});
};

export const openLibrary = (
	options: {
		modalController: ModalController;
		toastController?: ToastController;
	},
	callback: Function
) => {
	return checkLibrary({
		success: () => {
			getLibrary(callback);
		},
		warning: (message: string) => {
			if (options.toastController)
				APP_COMPONENT_IonToast(options.toastController, {
					color: 'warning',
					message,
					duration: 10000,
				}).then((toast) => toast.present());
		},
		error: (message: string) => {
			if (options.toastController)
				APP_COMPONENT_IonToast(options.toastController, {
					color: 'error',
					message,
					duration: 10000,
				}).then((toast) => toast.present());
		},
		setting: (message: string) => {
			if (options.toastController)
				options.toastController
					.create({
						color: 'medium',
						message: message,
						duration: 10000,
						animated: true,
						buttons: [
							{
								side: 'end',
								text: 'Cài đặt',
								handler: () => {
									NativeSettings.open({
										optionAndroid: AndroidSettings.ApplicationDetails,
										optionIOS: IOSSettings.App,
									});
								},
							},
							{ side: 'end', icon: 'close-outline', role: 'cancel' },
						],
					})
					.then((toast) => toast.present());
		},
	});
};

export const openCamera = (
	options: {
		modalController: ModalController;
		toastController?: ToastController;
	},
	callback: Function
) => {
	return checkCamera({
		success: () => {
			getCamera(callback);
		},
		warning: (message: string) => {
			if (options.toastController)
				APP_COMPONENT_IonToast(options.toastController, {
					color: 'warning',
					message,
					duration: 10000,
				}).then((toast) => toast.present());
		},
		error: (message: string) => {
			if (options.toastController)
				APP_COMPONENT_IonToast(options.toastController, {
					color: 'error',
					message,
					duration: 10000,
				}).then((toast) => toast.present());
		},
		setting: (message: string) => {
			if (options.toastController)
				options.toastController
					.create({
						color: 'medium',
						message: message,
						duration: 10000,
						animated: true,
						buttons: [
							{
								side: 'end',
								text: 'Cài đặt',
								handler: () => {
									NativeSettings.open({
										optionAndroid: AndroidSettings.ApplicationDetails,
										optionIOS: IOSSettings.App,
									});
								},
							},
							{ icon: 'close-outline', side: 'end', role: 'cancel' },
						],
					})
					.then((toast) => toast.present());
		},
	});
};

export const APP_GetPhoto = async (
	options: {
		modalController: ModalController;
		toastController?: ToastController;
	},
	callback: (files: File[]) => any
) => {
	//với bản web thì mở luôn chọn ảnh, khỏi cần lựa chọn
	if (Capacitor.getPlatform() == 'web') {
		openLibrary(options, callback);
	}
	//với bản mobile thì có 2 sự lựa chọn (thư viện hoặc chụp ảnh)
	else {
		let modal = await options.modalController.create({
			component: ModalPhotoComponent,
			cssClass: 'ion-modal-auto ion-modal-bottom',
			backdropDismiss: true,
			keyboardClose: true,
		});

		modal.onDidDismiss().then((e) => {
			if (e.role == 'submit') {
				switch (e.data) {
					case 'library': {
						openLibrary(options, callback);
						break;
					}
					case 'camera': {
						openCamera(options, callback);
						break;
					}
				}
			}
		});

		modal.present();
	}
};

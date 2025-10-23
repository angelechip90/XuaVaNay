import {
	ActionSheetController,
	ActionSheetOptions,
	AnimationController,
	ToastController,
	ToastOptions,
} from '@ionic/angular';

interface IOptionResponse {
    StatusCode?: number;
    Succeeded?: boolean;
    Message?: string;
    Data?: any;
    HasNextPage?: boolean;
    HasPreviousPage?: boolean;
    MaxPage?: number;
    PageNumber?: number;
    PageSize?: number;
    TotalPages?: number;
    TotalRecords?: number;
}

export const APP_COMPONENT_IonToast = async (
	thisController: ToastController,
	options: ToastOptions,
	response?: IOptionResponse
) => {
	if (!options.message) {
		if (response) {
			options.message = response?.Message ?? 'Hệ thống không có phản hồi!';

			if (!options.icon) {
				if (response?.Message) {
					options.icon = 'checkmark-circle-sharp';
				} else {
					options.icon = 'alert-circle-outline';
				}
			}

			if (!options.color) {
				if (response?.Succeeded) {
					options.color = 'success';
				} else if ((response?.StatusCode ?? 0) > 400) {
					options.color = 'danger';
				} else {
					options.color = 'warning';
				}
			}
		}
	}

	if (!options.position) {
		options.position = 'bottom';
	}
	if (!options.icon) {
		options.icon = 'bulb-outline';
	}
	if (!options.color) {
		options.color = 'secondary';
	}

	options.duration = options.duration ?? 3000;
	options.animated = options.animated ?? true;
	options.buttons = options.buttons ?? [
		{ icon: 'close-outline', side: 'end', role: 'cancel' },
	];

	return await thisController.create(options);
};

export const APP_COMPONENT_IonConfirm = async (
	thisController: ActionSheetController,
	options?: ActionSheetOptions,
	fnSuccess?: Function
) => {
	options = options ?? ({} as ActionSheetOptions);

	options.header = options.header ?? 'Bạn có chắc muốn xóa dữ liệu này?';

	options.buttons = options.buttons ?? [
		{
			text: 'Xóa',
			role: 'destructive',
			data: {
				action: 'delete',
			},
		},
		{
			text: 'Hủy',
			role: 'cancel',
			data: {
				action: 'cancel',
			},
		},
	];

	let item = await thisController.create(options);

	item.onDidDismiss().then((e) => {
		if (e.data.action == 'delete') {
			if (fnSuccess) fnSuccess();
		}
	});

	await item.present();
};

//---------//---------//---------//---------//---------//---------//---------//---------//---------//---------

export const enterAnimationModalLeft = (
	animationCtrl: AnimationController,
	baseEl: HTMLElement
) => {
	const root = baseEl.shadowRoot;

	const backdropAnimation = animationCtrl
		.create()
		.addElement(root?.querySelector('ion-backdrop')!)
		.fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

	const wrapperAnimation = animationCtrl
		.create()
		.addElement(root?.querySelector('.modal-wrapper')!)
		.keyframes([
			{ offset: 0, transform: 'translateX(-100%)' },
			{ offset: 1, transform: 'translateX(0%)' },
		]);

	return animationCtrl
		.create()
		.addElement(baseEl)
		.easing('ease-out')
		.duration(300)
		.addAnimation([backdropAnimation, wrapperAnimation]);
};

export const leaveAnimationModalLeft = (
	animationCtrl: AnimationController,
	baseEl: HTMLElement
) => {
	return enterAnimationModalLeft(animationCtrl, baseEl).direction('reverse');
};

export const enterAnimationModalRight = (
	animationCtrl: AnimationController,
	baseEl: HTMLElement
) => {
	const root = baseEl.shadowRoot;

	const backdropAnimation = animationCtrl
		.create()
		.addElement(root?.querySelector('ion-backdrop')!)
		.fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

	const wrapperAnimation = animationCtrl
		.create()
		.addElement(root?.querySelector('.modal-wrapper')!)
		.keyframes([
			{ offset: 0, transform: 'translateX(100%)' },
			{ offset: 1, transform: 'translateX(0%)' },
		]);

	return animationCtrl
		.create()
		.addElement(baseEl)
		.easing('ease-out')
		.duration(300)
		.addAnimation([backdropAnimation, wrapperAnimation]);
};

export const leaveAnimationModalRight = (
	animationCtrl: AnimationController,
	baseEl: HTMLElement
) => {
	return enterAnimationModalRight(animationCtrl, baseEl).direction('reverse');
};

export const enterAnimationModalCenter = (
	animationCtrl: AnimationController,
	baseEl: HTMLElement
) => {
	const root = baseEl.shadowRoot;

	const backdropAnimation = animationCtrl
		.create()
		.addElement(root?.querySelector('ion-backdrop')!)
		.fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

	const wrapperAnimation = animationCtrl
		.create()
		.addElement(root?.querySelector('.modal-wrapper')!)
		.keyframes([
			{ offset: 0, opacity: '0', transform: 'scale(0)' },
			{ offset: 1, opacity: '0.99', transform: 'scale(1)' },
		]);

	return animationCtrl
		.create()
		.addElement(baseEl)
		.easing('ease-out')
		.duration(300)
		.addAnimation([backdropAnimation, wrapperAnimation]);
};

export const leaveAnimationModalCenter = (
	animationCtrl: AnimationController,
	baseEl: HTMLElement
) => {
	return enterAnimationModalCenter(animationCtrl, baseEl).direction('reverse');
};

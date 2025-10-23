import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageCropperComponent } from 'ngx-image-cropper';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ModalPhotoCropperComponent } from '../modals/modal-photo-cropper/modal-photo-cropper.component';
import { ModalVoiceComponent } from '../modals/modal-voice/modal-voice.component';
import { ModalPhotoComponent } from '../modals/modal-photo/modal-photo.component';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        IonicModule,
        ImageCropperComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ModalPhotoComponent,
        ModalPhotoCropperComponent,
        ModalVoiceComponent,
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
    ]
})
export class LayoutModule { }

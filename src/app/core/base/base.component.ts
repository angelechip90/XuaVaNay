import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
  changeDetectorRef:ChangeDetectorRef;
  notificationSV:NotificationService;
  api:ApiService;
  router: Router;
  route: ActivatedRoute;
  platform:Platform;
  navCtrl:NavController;
  severUrl:string = '';
  storage:StorageService;
  constructor(
    protected injector: Injector
  ) {
    this.changeDetectorRef = this.injector.get(ChangeDetectorRef);
    this.notificationSV = this.injector.get(NotificationService);
    this.api = this.injector.get(ApiService);
    this.router = this.injector.get(Router);
    this.route = this.injector.get(ActivatedRoute);
    this.platform = this.injector.get(Platform);
    this.navCtrl = this.injector.get(NavController);
    this.storage = this.injector.get(StorageService);
    this.severUrl = environment.severUrl;
  }
}

import { Component, Injector } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BaseComponent } from './core/base/base.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent extends BaseComponent {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}
}

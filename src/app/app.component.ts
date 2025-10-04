import { Component, Injector } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CoreModule } from './core/core.module';
import { BaseComponent } from './core/base/base.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent extends BaseComponent{
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  async ngOnInit() {
    let result = await firstValueFrom(this.api.execByBody('Book', 'get-types', null,null, true));
    console.log(result);
  }
}

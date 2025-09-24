import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoPage } from './pages/demo/demo.page';

const routes: Routes = [
  {
    path: '',
    component: DemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }

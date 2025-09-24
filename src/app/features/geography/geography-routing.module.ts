import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeographyPage } from './pages/geography/geography.page';

const routes: Routes = [
    {
        path: '',
        component: GeographyPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeographyRoutingModule { }

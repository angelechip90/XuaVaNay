import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiSearchPage } from './pages/ai-search/ai-search.page';

const routes: Routes = [
    {
        path: '',
        component: AiSearchPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AiSearchRoutingModule { }

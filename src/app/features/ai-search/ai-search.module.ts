import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AiSearchRoutingModule } from './ai-search-routing.module';
import { AiSearchPage } from './pages/ai-search/ai-search.page';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchFiltersComponent } from './components/search-filters/search-filters.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        SharedModule,
        AiSearchRoutingModule,
        AiSearchPage,
        SearchResultsComponent,
        SearchFiltersComponent
    ]
})
export class AiSearchModule { }

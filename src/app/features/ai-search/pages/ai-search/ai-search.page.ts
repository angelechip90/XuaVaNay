import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-ai-search',
    templateUrl: './ai-search.page.html',
    styleUrls: ['./ai-search.page.scss'],
    imports: [
        IonContent,
        IonSearchbar,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonButton,
        IonIcon,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    standalone: true
})
export class AiSearchPage implements OnInit {
    searchForm: FormGroup;
    searchResults: any[] = [];
    isLoading = false;
    hasSearched = false;

    constructor(private formBuilder: FormBuilder) {
        this.searchForm = this.formBuilder.group({
            query: ['', [Validators.required, Validators.minLength(2)]]
        });
    }

    ngOnInit() { }

    onSearch() {
        if (this.searchForm.valid) {
            this.isLoading = true;
            this.hasSearched = true;

            // Simulate API call
            setTimeout(() => {
                this.searchResults = [
                    { id: 1, title: 'Kết quả tìm kiếm 1', content: 'Nội dung kết quả 1' },
                    { id: 2, title: 'Kết quả tìm kiếm 2', content: 'Nội dung kết quả 2' }
                ];
                this.isLoading = false;
            }, 1000);
        }
    }

    clearSearch() {
        this.searchForm.reset();
        this.searchResults = [];
        this.hasSearched = false;
    }
}

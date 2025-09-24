import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonToggle,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonChip,
  IonBadge,
  IonAvatar,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import shared components
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.page.html',
  styleUrls: ['./demo.page.scss'],
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonToggle,
    IonRange,
    IonSegment,
    IonSegmentButton,
    IonChip,
    IonBadge,
    IonAvatar,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    CustomButtonComponent,
    DateFormatPipe
  ],
  standalone: true
})
export class DemoPage implements OnInit {
  // Form data
  demoForm: FormGroup;

  // Demo data
  isLoading = false;
  hasError = false;
  errorMessage = '';
  selectedSegment = 'components';

  // Sample data
  sampleDate = new Date();
  sampleBooks = [
    { id: 1, title: 'Lịch sử Việt Nam', author: 'Nguyễn Văn A', category: 'Lịch sử' },
    { id: 2, title: 'Địa lý Việt Nam', author: 'Trần Thị B', category: 'Địa lý' },
    { id: 3, title: 'Văn hóa Việt Nam', author: 'Lê Văn C', category: 'Văn hóa' }
  ];

  sampleHistory = [
    { id: 1, title: 'Việt Nam thời kỳ cổ đại', period: 'Thời kỳ cổ đại', description: 'Lịch sử Việt Nam từ thời kỳ cổ đại...' },
    { id: 2, title: 'Thời kỳ phong kiến', period: 'Thời kỳ phong kiến', description: 'Các triều đại phong kiến Việt Nam...' }
  ];

  sampleGeography = [
    { id: 1, name: 'Hà Nội', type: 'city', description: 'Thủ đô của Việt Nam' },
    { id: 2, name: 'Vịnh Hạ Long', type: 'landmark', description: 'Di sản thế giới UNESCO' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.demoForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      category: ['', [Validators.required]],
      description: [''],
      notifications: [true],
      darkMode: [false]
    });
  }

  ngOnInit() { }

  // Demo methods
  showLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  showError() {
    this.hasError = true;
    this.errorMessage = 'Đây là thông báo lỗi demo';
    setTimeout(() => {
      this.hasError = false;
    }, 3000);
  }

  onCustomButtonClick() {
    console.log('Custom button clicked!');
  }

  onFormSubmit() {
    if (this.demoForm.valid) {
      console.log('Form submitted:', this.demoForm.value);
      alert('Form submitted successfully!');
    } else {
      console.log('Form is invalid');
    }
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  onRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onInfiniteScroll(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onSearchChange(event: any) {
    console.log('Search:', event.detail.value);
  }
}

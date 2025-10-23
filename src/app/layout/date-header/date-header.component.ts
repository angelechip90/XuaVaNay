import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonAvatar, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserInfo } from 'src/app/models/User.model';

@Component({
  selector: 'app-date-header',
  templateUrl: './date-header.component.html',
  styleUrls: ['./date-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonAvatar, IonIcon],
})
export class DateHeaderComponent implements OnInit {
  todayText: string = '';
  userProfile: UserInfo | null = null;
  constructor(private authService: AuthService) {
    addIcons({ chevronDownOutline });
  }

  ngOnInit(): void {
    const now = new Date();
    this.todayText = `${this.getVietnameseWeekday(now)}, ${this.formatDate(
      now
    )}`;

    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.getUserInfo().then((user) => {
      if (user) {
        this.userProfile = user;
      }
    });
  }

  private getVietnameseWeekday(date: Date): string {
    const day = date.getDay();
    const map: Record<number, string> = {
      0: 'Chủ nhật',
      1: 'Thứ 2',
      2: 'Thứ 3',
      3: 'Thứ 4',
      4: 'Thứ 5',
      5: 'Thứ 6',
      6: 'Thứ 7',
    };
    return map[day];
  }

  private formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}

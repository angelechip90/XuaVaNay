import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }

  navigateToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  navigateToChangePassword(): void {
    this.router.navigateByUrl('/change-password');
  }

  navigateToHome(): void {
    this.router.navigateByUrl('/tabs');
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  goBack(): void {
    history.back();
  }
}

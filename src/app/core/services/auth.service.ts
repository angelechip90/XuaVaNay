import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IUser } from 'src/app/models/IUser.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    // Load user from storage on init
    this.loadUserFromStorage();
  }

  async login(
    identifier: string,
    password: string
  ): Promise<{ Succeeded: boolean; Message?: string; Data?: IUser }> {
    try {
      // Mock login - replace with actual API call
      let result = await firstValueFrom(
        this.api.execApi('Auth', 'login', 'POST', { identifier, password })
      );
      if (result && result?.Succeeded) {
        let user = result?.Data;
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
        return { Succeeded: true, Data: user };
      } else {
        return { Succeeded: false, Message: result?.Message };
      }
    } catch (error) {
      return { Succeeded: false };
    }
  }

  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
    this.clearUserFromStorage();
  }

  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    var user = this.currentUserSubject.value;
    const currentTime: number = Math.floor(Date.now() / 1000);
    if (
      user &&
      user.Token &&
      user.Token.AccessToken &&
      user.Token.ExpiresIn > currentTime
    ) {
      return true;
    }
    this.logout();
    return false;
  }

  private loadUserFromStorage(): void {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
  }

  private saveUserToStorage(user: IUser): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  private clearUserFromStorage(): void {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/models/IUser.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
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

  public saveUser(user: IUser): void {
    this.currentUserSubject.next(user);
    this.saveUserToStorage(user);
  }

  private saveUserToStorage(user: IUser): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  public clearUser(): void {
    this.currentUserSubject.next(null);
    this.clearUserFromStorage();
  }

  private clearUserFromStorage(): void {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  }

  public getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
}

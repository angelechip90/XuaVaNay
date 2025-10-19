import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/models/IUser.model';
import { StorageService } from './storage.service';
import { User } from 'src/app/models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private storage:StorageService
  ) {
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

  public saveUser(user: User): void {
    this.currentUserSubject.next(user);
    this.saveUserToStorage(user);
  }

  private saveUserToStorage(user: User): void {
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

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}

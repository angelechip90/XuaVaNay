import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  FullName?: string;
  Email?: string;
  PhoneNumber?: string;
  Gender?: string;
  Birthday?: string;
  Address?: string;
  Job?: string;
  Avatar?: string;
  IsVerify?: boolean;
  Ugroups?: any[];
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Load user from storage on init
    this.loadUserFromStorage();
  }

  async login(identifier: string, password: string): Promise<{ Succeeded: boolean; Message?: string; Data?: IUser }> {
    try {
      // Mock login - replace with actual API call
      if (identifier && password) {
        const user: IUser = {
          id: '1',
          username: identifier,
          email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
          FullName: 'Test User',
          Email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
          PhoneNumber: '0123456789',
          Gender: '1',
          Birthday: '1990-01-01',
          Address: 'Test Address',
          Job: 'Developer',
          Avatar: '',
          IsVerify: true,
          Ugroups: []
        };

        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
        
        return { Succeeded: true, Data: user };
      } else {
        return { Succeeded: false, Message: 'Vui lòng nhập đầy đủ thông tin' };
      }
    } catch (error) {
      return { Succeeded: false, Message: 'Đăng nhập thất bại' };
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
    return this.currentUserSubject.value !== null;
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

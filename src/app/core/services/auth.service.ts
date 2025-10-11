import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IUser, IUserInfo } from 'src/app/models/IUser.model';
import { AuthStorageService } from './auth.storeage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private api: ApiService,
    private authStorageService: AuthStorageService
  ) {}

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
        this.authStorageService.saveUser(user);
        return { Succeeded: true, Data: user };
      } else {
        return { Succeeded: false, Message: result?.Message };
      }
    } catch (error) {
      return { Succeeded: false };
    }
  }

  async logout(): Promise<void> {
    var user = this.authStorageService.getCurrentUser();
    if (user) {
      this.api
        .execApi('Auth', 'logout', 'POST', {
          RefreshToken: user.Token.RefreshToken,
        })
        .subscribe((result) => {
          if (result && result?.Succeeded) {
            this.authStorageService.clearUser();
          }
        });
    }
  }

  async refreshToken(): Promise<void> {
    var user = this.authStorageService.getCurrentUser();
    if (user) {
      this.api
        .execApi('Auth', 'refresh-token', 'POST', {
          RefreshToken: user.Token.RefreshToken,
        })
        .subscribe((result) => {
          if (result && result?.Succeeded) {
            this.authStorageService.saveUser(result.Data);
          }
        });
    }
  }

  async getUserInfo(): Promise<IUserInfo | null> {
    const user = this.authStorageService.getCurrentUser();
    if (user) {
      const result = await firstValueFrom(
        this.api.execApi('Auth', 'me', 'GET')
      );
      if (result && result?.Succeeded) {
        return result.Data;
      }
    }
    return null;
  }

  getCurrentUser(): IUser | null {
    return this.authStorageService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    var user = this.authStorageService.getCurrentUser();
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
}

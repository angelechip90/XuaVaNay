import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, delay, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';
import { AuthStorageService } from './auth.storeage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private notificationSV: NotificationService,
    private authStorageService: AuthStorageService
  ) {}

  execApi(
    controller: string,
    router: string,
    method: 'GET' | 'POST' = 'POST',
    data: any = null,
    queryParams: any = null,
    showLoad: boolean = false
  ): Observable<any> {
    const authToken = this.getAuthToken();

    let headers = new HttpHeaders();
    if (authToken) {
      headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });
    }

    let params = new HttpParams();
    if (queryParams) {
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.set(key, queryParams[key]);
        }
      }
    }

    let timeout = 0;
    if (showLoad) {
      this.isLoad(true);
    }

    let request$;
    if (method === 'POST') {
      request$ = this.httpClient.post(
        environment.severUrl + 'api/' + controller + '/' + router,
        data,
        { headers, params }
      );
    } else {
      request$ = this.httpClient.get(
        environment.severUrl + 'api/' + controller + '/' + router,
        { headers, params }
      );
    }

    return request$.pipe(
      delay(timeout),
      catchError(this.handleError),
      switchMap((response: any) => {
        if (showLoad) this.isLoad(false);
        if (response instanceof HttpErrorResponse) {
          this.notificationSV.showError(
            'Đã có lỗi trong quá trình thực thi hệ thống! Vui lòng thử lại'
          );
          return throwError(() => new Error(response.message));
        } else {
          if (response?.Succeeded) {
            return of(response);
          } else {
            this.notificationSV.showError(
              response?.Message ||
                'Đã có lỗi trong quá trình thực thi hệ thống! Vui lòng thử lại'
            );
            return of(null);
          }
        }
      })
    );
  }

  /**
   * Lấy access token từ AuthStorageService
   */
  private getAuthToken(): string | null {
    const user = this.authStorageService.getCurrentUser();
    return user?.Token?.AccessToken || null;
  }

  private isLoad(show: boolean = false): void {
    const loader = document.getElementById('loader-icon');
    if (loader) {
      loader.style.visibility = show ? 'visible' : 'hidden';
    }
  }

  private async handleError(error: HttpErrorResponse) {
    console.error('API Error:', error.message);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}

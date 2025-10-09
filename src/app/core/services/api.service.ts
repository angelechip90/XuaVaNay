import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, delay, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { IUser } from 'src/app/models/IUser.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  authToken: any;
  constructor(
    private httpClient: HttpClient,
    private storage: StorageService,
    private notificationSV: NotificationService
  ) {}

  execApi(
    controller: any,
    router: any,
    method: 'GET' | 'POST' = 'POST',
    data: any = null,
    queryParams: any = null,
    showLoad: any = false
  ) {
    // Lấy token từ localStorage
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
      //timeout = 100;
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
   * Lấy access token từ localStorage
   */
  private getAuthToken(): string | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user: IUser = JSON.parse(userStr);
        return user?.Token?.AccessToken || null;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return null;
  }

  isLoad(type: any = false) {
    let loader = document.getElementById('loader-icon');
    if (loader) {
      if (type) {
        loader.style.visibility = 'visible';
      } else {
        loader.style.visibility = 'hidden';
      }
    }
  }

  private async handleError(error: HttpErrorResponse) {
    console.log(error.message);
    // if (error.status === 0) {
    //     console.log(error.message);
    // } else {
    //     console.log(error.message);
    // }
    //this.isLoad(false);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  // private baseUrl = environment.apiUrl || '';

  // constructor(private http: HttpClient) { }

  // get<T>(endpoint: string, params?: HttpParams): Observable<T> {
  //     return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  // }

  // post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
  //     return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { headers });
  // }

  // put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
  //     return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { headers });
  // }

  // delete<T>(endpoint: string): Observable<T> {
  //     return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  // }

  // patch<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
  //     return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, { headers });
  // }
}

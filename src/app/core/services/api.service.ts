import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, delay, from, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    authToken: any;
    constructor(
        private httpClient: HttpClient,
        private storage: StorageService,
        private notificationSV: NotificationService
    ) {
    }

    execByBody(controller: any, router: any, data: any = null,queryParams: any = null, showLoad: any = false) {
        return from(this.storage.get(environment.keyToken)).pipe(
            switchMap((authToken: string | null) => {
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

                return this.httpClient
                    .post(
                        environment.severUrl + 'api/' + controller + '/' + router,
                        data,
                        { headers: headers, params }
                    )
                    .pipe(
                        delay(timeout),
                        catchError(this.handleError),
                        switchMap((response: any) => {
                            if (showLoad) this.isLoad(false);
                            if (response instanceof HttpErrorResponse) {
                                this.notificationSV.showError(
                                    'Đã có lỗi trong quá trình thực thi hệ thống! Vui lòng thử lại',
                                );
                                return throwError(() => new Error(response.message));
                            } else {
                                return of(response);
                            }
                        })
                    );
            })
        );
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
        return throwError(() => new Error('Something bad happened; please try again later.'));
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

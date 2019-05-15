import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, retryWhen, take, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  private exceptions: string[] = [
    'login',
    'whoami'
  ];

  constructor(private router: Router) {

  }

  /**
   * Intercepts all requests
   * - in case of an error (network errors included) it repeats a request 3 times
   * - all other error can be handled an error specific case
   * and redirects into specific error pages if necessary
   *
   * There is an exception list for specific urls that we don't want the application to act
   * automatically i.e. login/whoami
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!environment.production) {
      const currentdate = new Date();
      const datetime = 'Request at: ' + currentdate.getDate() + '/'
          + (currentdate.getMonth() + 1) + '/'
          + currentdate.getFullYear() + ' @ '
          + currentdate.getHours() + ':'
          + currentdate.getMinutes() + ':'
          + currentdate.getSeconds();
      console.log(datetime + ' on ' + request.url);
  }

    if (!this.exceptions.every((term: string) => request.url.indexOf(term) === -1)) {
      return next.handle(request).pipe(tap((response: any) => {
      }, (error) => {
      }));
    }

    return next.handle(request).pipe(retryWhen(
      error => {
        return error.pipe(take(3), delay(1500),
          tap((response: any) => {
            if (response.status === 403 || response.status === 401) {
              this.router.navigate(['/unauthorized']);
            }
            throw error;
          })
        );
      }
    ));
  }
}

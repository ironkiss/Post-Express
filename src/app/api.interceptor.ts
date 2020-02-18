import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

import { Observable } from 'rxjs';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('this.authService', request.body, this.authService.getToken())

    // request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});

    if (!request.headers.has('Accept')) {
      request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    }

    console.log('request', request)

    if (this.authService.getToken() && !request.headers.has('Authorization')) {
      request = request.clone({headers: request.headers.set('Authorization', `Bearer ${this.authService.getToken()}`)});
    }

    // let headers: any = request.headers
    //   .set('Accept', 'application/json')
    //   .set('Access-Control-Allow-Origin', '*')
    //   .set('Authorization', `Bearer ${this.authService.getToken()}`)

    // if (this.authService.getToken()) {
    //   headers.append('Authorization', `Bearer ${this.authService.getToken()}`)
    // }

    // request.headers.append()

    // let setHeaders = {}
    //
    // if (this.authService.getToken()) {
    //   setHeaders = {
    //     ...setHeaders,
    //     'Authorization': `Bearer ${this.authService.getToken()}`
    //   }
    // }
    //
    // request = request.clone({
    //   headers,
    //   withCredentials: true
    // });

    return next.handle(request);
  }
}

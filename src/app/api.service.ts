import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }   from '@angular/common/http';
// import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  authToken: string;
  private protocol: string = 'http';
  private siteDomain: string = 'post-express.eu/api/public/index.php';
  private url: string = `${this.protocol}://${this.siteDomain}/api/v1`;

  constructor(public http: HttpClient) {}

  get(endpoint: string, params?: any, options?: any) {
    if (!options) { options = {}; }
    const url = options && options.url || this.url

    if (params) {
      const httpParams = new HttpParams();
      for(let k in params) {
        httpParams.set(k, params[k]);
      }

      options.params = !options.params && httpParams || options.params;
    }

    options = this.createAuthorizationHeader(options);

    console.log('options', options)

    return this.http.get(`${url}/${endpoint}`, options);
  }

  post(endpoint: string, params: any, options?: any) {
    const url = options && options.url || this.url

    options = this.createAuthorizationHeader(options);
    const body = new FormData();
    for (const key of Object.keys(params)) {
      body.append(key, params[key])
    }
    console.log('body', JSON.stringify(params), options)

    return this.http.post(`${url}/${endpoint}`, params, options);
  }

  put(endpoint: string, body: any, options?: any) {
    options = this.createAuthorizationHeader(options);
    return this.http.put(`${this.url}/${endpoint}`, body, options);
  }

  delete(endpoint: string, body: any, options?: any) {
    options = this.createAuthorizationHeader(options);
    return this.http.post(`${this.url}/${endpoint}`, body, options);
  }

  patch(endpoint: string, body: any, options?: any) {
    options = this.createAuthorizationHeader(options);
    return this.http.patch(`${this.url}/${endpoint}`, body, options);
  }

  private createAuthorizationHeader(options: any): any {
    if (!options) {
      options = {};
    }

    // const headers = new HttpHeaders({
    //   'Accept': 'application/json',
    //   'Access-Control-Allow-Origin': '*',
    //   'Authorization': this.authToken ? `Bearer ${this.authToken}` : null
    // });
    //
    // options.headers = headers;

    return options;
  }
}

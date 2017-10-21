import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {
  private url: string = '';

  constructor(public http: Http) {
    console.log('Hello ApiProvider Provider');
  }

  public get(url: string, params?: any, options?: RequestOptions) {
    if (!options) { options = new RequestOptions(); }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for(let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    // options = this.createAuthorizationHeader(options);

    return this.http.get(url, options);
  }

  public post(endpoint: string, body: any, options?: RequestOptions) {
    // options = this.createAuthorizationHeader(options);
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  public put(endpoint: string, body: any, options?: RequestOptions) {
    // options = this.createAuthorizationHeader(options);
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  public delete(endpoint: string, body: any, options?: RequestOptions) {
    // options = this.createAuthorizationHeader(options);
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  public patch(endpoint: string, body: any, options?: RequestOptions) {
    // options = this.createAuthorizationHeader(options);
    return this.http.patch(this.url + '/' + endpoint, body, options);
  }

}

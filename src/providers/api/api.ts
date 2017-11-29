import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {
  public authToken: string;
  private protocol: string = 'http';
  private siteDomain: string = 'post-express.eu/api/public/index.php';
  // private siteDomain: string = '192.168.0.102:3000';
  private url: string = `${this.protocol}://${this.siteDomain}/api/v1`;

  constructor(public http: Http) {}

  public get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) { options = new RequestOptions(); }

    if (params) {
      let p = new URLSearchParams();
      for(let k in params) {
        p.set(k, params[k]);
      }

      options.search = !options.search && p || options.search;
    }

    options = this.createAuthorizationHeader(options);

    return this.http.get(`${this.url}/${endpoint}`, options);
  }

  public post(endpoint: string, body: any, options?: RequestOptions) {
    options = this.createAuthorizationHeader(options);
    return this.http.post(`${this.url}/${endpoint}`, body, options);
  }

  public put(endpoint: string, body: any, options?: RequestOptions) {
    options = this.createAuthorizationHeader(options);
    return this.http.put(`${this.url}/${endpoint}`, body, options);
  }

  public delete(endpoint: string, body: any, options?: RequestOptions) {
    options = this.createAuthorizationHeader(options);
    return this.http.post(`${this.url}/${endpoint}`, body, options);
  }

  public patch(endpoint: string, body: any, options?: RequestOptions) {
    options = this.createAuthorizationHeader(options);
    return this.http.patch(`${this.url}/${endpoint}`, body, options);
  }

  private createAuthorizationHeader(options: RequestOptions): RequestOptions {
    if (!options) {
      options = new RequestOptions();
    }

    let headers = new Headers();

    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    if (this.authToken)
      headers.append('Authorization', `Bearer ${this.authToken}`);

    options.headers = headers;

    return options;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }   from '@angular/common/http';

import { HTTP } from '@ionic-native/http/ngx';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  authToken: string;
  private protocol: string = 'http';
  private siteDomain: string = 'post-express.eu/api/public/index.php';
  private url: string = `${this.protocol}://${this.siteDomain}/api/v1`;

  constructor(public http: HttpClient, private nativeHTTP: HTTP) {}

  get(endpoint: string, params?: any, options?: any) {
    if (!options) { options = {}; }
    const url = options && options.url || this.url
    const headers = this.createHeaders(options);

    console.log('headers', headers)

    return this.nativeHTTP.get(`${url}/${endpoint}`, params, headers);
  }

  post(endpoint: string, params: any, options?: any) {
    const url = options && options.url || this.url
    const headers = this.createHeaders(options);

    console.log('url', url)
    console.log('params', params)
    console.log('headers', headers)

    return new Promise((resolve, reject) => {
      this.nativeHTTP.post(`${url}/${endpoint}`, params, headers).then(data => {
        console.log('data', data)
        resolve({
          data: JSON.parse(data.data),
          status: data.status
        })
      }).catch(error => {
        console.log('error', error)
        reject({
          error: JSON.parse(error.error),
          status: error.status
        })
      });
    })
  }

  private createHeaders(options: any): any {
    if (!options) {
      options = {};
    }

    const headers = options.headers || {}

    if (!headers['Accept']) {
      headers['Accept'] = 'application/json'
    }

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.authToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers;
  }
}

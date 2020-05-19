import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }   from '@angular/common/http';
import { Platform } from '@ionic/angular'

import { HTTP } from '@ionic-native/http/ngx';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  authToken: string;
  private protocol: string = 'https';
  private siteDomain: string = 'post-express.eu/api/public/index.php';
  private url: string = `${this.protocol}://${this.siteDomain}/api/v1`;

  constructor(public http: HttpClient, private nativeHTTP: HTTP, private platform: Platform) {}

  get(endpoint: string, params?: any, options?: any) {
    if (!options) { options = {}; }
    const url = options && options.url || this.url
    
    
    if (this.platform.is('ios')) {
      if (params) {
        const httpParams = new HttpParams();
        for(let k in params) {
          httpParams.set(k, params[k]);
        }
        
        options.params = !options.params && httpParams || options.params;
      }

      return new Promise((resolve, reject) => {
        this.http.get(`${url}/${endpoint}`, options)
          .subscribe(data => resolve({ data, status: 200 }), error => reject({ error, status: 400 }))
      })
    }
    
    const headers = this.createHeaders(options);
    console.log('headers', headers)

    return new Promise((resolve, reject) => {
      this.nativeHTTP.get(`${url}/${endpoint}`, params, headers).then(data => {
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

  post(endpoint: string, params: any, options?: any) {
    const url = options && options.url || this.url
    
    console.log('url', url)
    console.log('params', params)
    
    if (this.platform.is('ios')) {
      return new Promise((resolve, reject) => {
        this.http.post(`${url}/${endpoint}`, params, options)
          .subscribe(data => resolve({ data, status: 200 }), error => reject({ error, status: 400 }))
      })
    }
    
    const headers = this.createHeaders(options);
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

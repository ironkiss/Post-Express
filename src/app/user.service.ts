import { Injectable } from '@angular/core';

import { APIService } from './api.service';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: any = {};

  constructor(
    private apiService: APIService,
    private storage: Storage
  ) {
    this.getUserData().then((userData: User) => {
      console.log('nativeStorage.getItem[user_data]', userData);
      this.user = userData;
      this.apiService.authToken = userData ? userData.token : null;
    }).catch((err: any) => console.error('nativeStorage.getItem[user_data]', err));
  }

  getUserData = () => this.storage.get('user_data')
}

interface User {
  id: number;
  name: string;
  email: string;
  token: string
}

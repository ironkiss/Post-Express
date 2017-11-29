import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {
  public user: any = {};

  constructor(
    private apiPrvd: ApiProvider,
    private storage: Storage
  ) {
    this.storage.get('user_data').then((userData: User) => {
      console.log('nativeStorage.getItem[user_data]', userData);
      this.user = userData;
      this.apiPrvd.authToken = userData.token;
    }).catch((err: any) => console.error('nativeStorage.getItem[user_data]', err));
  }

}

interface User {
  id: number;
  name: string;
  email: string;
  token: string
}

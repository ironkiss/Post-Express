import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';

import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class UserProvider {
  public user: any = {};

  constructor(
    private apiPrvd: ApiProvider,
    private nativeStorage: NativeStorage
  ) {
    console.log('Hello UserProvider Provider');
    this.nativeStorage.getItem('user_data').then((userData: User) => {
      this.user = userData;
      this.apiPrvd.authToken = userData.api_token;
    }).catch((err: any) => console.error('nativeStorage.getItem[user_data]', err));
  }

}

interface User {
  id: number;
  name: string;
  email: string;
  api_token: string
}

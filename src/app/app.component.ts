import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SignInPage } from '../pages/sign-in/sign-in';
import { CameraPage } from '../pages/camera/camera';
import { BarcodeFormPage } from '../pages/barcode-form/barcode-form';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class PostExpress {
  rootPage: any = null;

  constructor(
    platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authPrvd: AuthProvider
  ) {
    platform.ready().then(() => {
      this.authPrvd.isLogged().then(() => {
        this.rootPage = BarcodeFormPage;
        this.hideSplash();
      }).catch(() => {
        this.rootPage = SignInPage;
        this.hideSplash();
      });
    });
  }

  private hideSplash(): void {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}

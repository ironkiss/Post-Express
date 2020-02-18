import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {

    console.log('moment', moment('2020-01-18').day())

    this.platform.ready().then(async () => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();

      let path = '/barcode-form'
      try {
        await this.authService.isLogged()
        path = '/barcode-form'
      } catch (error) {
        path = '/sign-in'
      }
      this.router.navigate([path], { replaceUrl: true });
    });
  }
}

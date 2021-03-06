import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';

import { IonicApp, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CameraPreview } from '@ionic-native/camera-preview';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';

import { PostExpress } from './app.component';
import { SignInPage } from '../pages/sign-in/sign-in';
import { BarcodeFormPage } from '../pages/barcode-form/barcode-form';
import { CameraPage } from '../pages/camera/camera';
import { FinishPage } from '../pages/finish/finish';

import { ApiProvider } from '../providers/api/api';
import { UserProvider } from '../providers/user/user';
import { ToolsProvider } from '../providers/tools/tools';
import { AuthProvider } from '../providers/auth/auth';
import { FormProvider } from '../providers/form/form';
import { CameraProvider } from '../providers/camera/camera';

@NgModule({
  declarations: [
    PostExpress,
    SignInPage,
    BarcodeFormPage,
    CameraPage,
    FinishPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(PostExpress),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PostExpress,
    SignInPage,
    BarcodeFormPage,
    CameraPage,
    FinishPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    CameraPreview,
    InAppBrowser,
    ThemeableBrowser,
    ApiProvider,
    UserProvider,
    ToolsProvider,
    AuthProvider,
    FormProvider,
    CameraProvider,
    CameraProvider
  ]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';

import { BarcodeFormPage } from './barcode-form.page';

const routes: Routes = [
  {
    path: '',
    component: BarcodeFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    BarcodeScanner,
    DatePicker
  ],
  declarations: [BarcodeFormPage]
})
export class BarcodeFormPageModule {}

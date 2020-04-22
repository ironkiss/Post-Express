import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatePickerModule } from 'ionic4-date-picker';

import { BarcodeFormPage } from './barcode-form.page';

const routes: Routes = [
  {
    path: '',
    component: BarcodeFormPage
  }
];

@NgModule({
  imports: [
    DatePickerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    BarcodeScanner
  ],
  declarations: [BarcodeFormPage]
})
export class BarcodeFormPageModule {}

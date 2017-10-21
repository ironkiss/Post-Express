import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeFormPage } from './barcode-form';

@NgModule({
  declarations: [
    BarcodeFormPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodeFormPage),
  ],
})
export class BarcodeFormPageModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'barcode-form', loadChildren: './barcode-form/barcode-form.module#BarcodeFormPageModule' },
  { path: 'camera', loadChildren: './camera/camera.module#CameraPageModule' },
  { path: 'finish', loadChildren: './finish/finish.module#FinishPageModule' },
  { path: 'sign-in', loadChildren: './sign-in/sign-in.module#SignInPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

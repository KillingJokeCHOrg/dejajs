import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DejaSnackbarComponent } from './snackbar.component';

@NgModule({
  declarations: [DejaSnackbarComponent],
  exports: [ DejaSnackbarComponent ],
  imports: [
    CommonModule,
  ],
})
export class DejaSnackbarModule { }

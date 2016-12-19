import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { DejaRangeComponent } from './range.component';

@NgModule({
    declarations: [DejaRangeComponent],
    exports: [DejaRangeComponent],
    imports: [
        CommonModule,
        MaterialModule.forRoot(),
    ],
})
export class DejaRangeModule { }

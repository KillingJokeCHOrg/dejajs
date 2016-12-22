import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DejaBoldQueryComponent } from './index';

@NgModule({
    declarations: [
        DejaBoldQueryComponent,
    ],
    exports: [DejaBoldQueryComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaBoldQueryModule { }

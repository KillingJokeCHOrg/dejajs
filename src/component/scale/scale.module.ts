import { CommonModule } from '@angular/common';
import { DejaScaleComponent, DejaScaleZoomFactorDirective } from "./index";
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [DejaScaleZoomFactorDirective, DejaScaleComponent],
    exports: [DejaScaleComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaScaleModule { }

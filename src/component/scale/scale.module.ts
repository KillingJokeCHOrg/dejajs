import { CommonModule } from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DejaScaleComponent, DejaScaleZoomFactorDirective, ScaleService } from "./index";

@NgModule({
    declarations: [DejaScaleZoomFactorDirective, DejaScaleComponent],
    exports: [DejaScaleComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
    providers: [ScaleService],
})
export class DejaScaleModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DejaScaleModule,
            providers: [ScaleService],
        };
    }
}

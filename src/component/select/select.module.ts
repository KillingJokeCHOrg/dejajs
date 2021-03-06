import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdInputModule } from '@angular/material';
import { DejaBackdropModule } from "../backdrop";
import { DejaDropDownModule } from "../dropdown";
import { DejaSelectComponent } from "./select.component";

@NgModule({
    declarations: [
        DejaSelectComponent,
    ],
    exports: [
        DejaSelectComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MdInputModule.forRoot(),
        DejaDropDownModule,
        DejaBackdropModule,
    ],
})
export class DejaSelectModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DejaSelectModule,
            providers: [],
        };
    }
}

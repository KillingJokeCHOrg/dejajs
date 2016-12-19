import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DejaEditableModule } from '../content-editable';
import { DejaDragDropModule } from '../dragdrop';
import { DejaTileGroupComponent, DejaTilesComponent } from "./";

@NgModule({
    declarations: [DejaTilesComponent, DejaTileGroupComponent],
    exports: [DejaTilesComponent, DejaTileGroupComponent],
    imports: [
        CommonModule,
        FormsModule,
        DejaDragDropModule,
        DejaEditableModule,
    ],
})
export class DejaTilesModule { }

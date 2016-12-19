import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DejaCircularPickerComponent } from './circular-picker.component';

@NgModule({
    declarations: [DejaCircularPickerComponent],
    exports: [DejaCircularPickerComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaCircularPickerModule { }

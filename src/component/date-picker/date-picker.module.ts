import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DejaDropDownModule } from '../dropdown';
import { DejaBackdropModule } from '../backdrop';
import { DejaDateSelectorModule }   from '../date-selector';
import { DejaCircularPickerModule }   from '../circular-picker/index';
import { DejaDatePickerComponent } from './date-picker.component';

import { MdInputModule, MdIconModule, MdButtonModule } from '@angular/material';

@NgModule({
    imports: [
        DejaBackdropModule,
        CommonModule,
        DejaCircularPickerModule,
        DejaDateSelectorModule,
        DejaDropDownModule,
        FormsModule,
        MdIconModule,
        MdInputModule,
        MdButtonModule,
    ],
    declarations: [DejaDatePickerComponent],
    exports: [DejaDatePickerComponent],
})
export class DejaDatePickerModule { }

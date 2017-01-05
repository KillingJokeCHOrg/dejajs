import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdIconModule, MdInputModule } from '@angular/material';
import { DejaBackdropModule } from '../backdrop';
import { DejaCircularPickerModule }   from '../circular-picker/index';
import { DejaDateSelectorModule }   from '../date-selector';
import { DejaDropDownModule } from '../dropdown';
import { DejaDatePickerComponent } from './date-picker.component';

@NgModule({
    declarations: [DejaDatePickerComponent],
    exports: [DejaDatePickerComponent],
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
})
export class DejaDatePickerModule { }

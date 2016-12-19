import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DejaCircularPickerModule }   from '../circular-picker/index';
import { DejaDateSelectorComponent }   from './date-selector.component';

import { MdButtonModule, MdIconModule } from '@angular/material';

@NgModule({
    imports: [
        DejaCircularPickerModule,
        CommonModule,
        FormsModule,
        MdButtonModule.forRoot(),
        MdIconModule.forRoot(),
    ],
    declarations: [DejaDateSelectorComponent],
    exports: [DejaDateSelectorComponent],
})
export class DejaDateSelectorModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdIconModule } from '@angular/material';
import { DejaCircularPickerModule }   from '../circular-picker/index';
import { DejaDateSelectorComponent }   from './date-selector.component';

@NgModule({
    declarations: [DejaDateSelectorComponent],
    exports: [DejaDateSelectorComponent],
    imports: [
        DejaCircularPickerModule,
        CommonModule,
        FormsModule,
        MdButtonModule.forRoot(),
        MdIconModule.forRoot(),
    ],
})
export class DejaDateSelectorModule { }

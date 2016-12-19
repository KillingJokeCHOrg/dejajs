import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { MdButtonModule } from '@angular/material';
import { DejaColorSelectorModule  } from '../color-selector/index';
import { DejaDropDownModule } from '../dropdown/index';
import { DejaColorPickerComponent  } from './index';

@NgModule({
    declarations: [DejaColorPickerComponent],
    exports: [DejaColorPickerComponent],
    imports: [
        CommonModule,
        FormsModule,
        DejaColorSelectorModule,
        DejaDropDownModule,
        MdButtonModule.forRoot(),
    ],
})
export class DejaColorPickerModule { }

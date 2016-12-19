import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { DejaColorSelectorComponent  } from './index';

@NgModule({
    declarations: [DejaColorSelectorComponent],
    exports: [DejaColorSelectorComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaColorSelectorModule { }

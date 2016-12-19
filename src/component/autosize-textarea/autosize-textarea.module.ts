import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdInputModule } from "@angular/material";
import { DejaAutosizeTextAreaDirective } from './index';

@NgModule({
    declarations: [DejaAutosizeTextAreaDirective],
    exports: [DejaAutosizeTextAreaDirective],
    imports: [
        CommonModule,
        FormsModule,
        MdInputModule,
    ],
})
export class DejaAutosizeTextAreaModule { }

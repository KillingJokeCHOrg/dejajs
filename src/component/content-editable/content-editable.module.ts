import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { DejaEditableDirective  } from './index';

@NgModule({
    declarations: [DejaEditableDirective],
    exports: [DejaEditableDirective],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaEditableModule { }

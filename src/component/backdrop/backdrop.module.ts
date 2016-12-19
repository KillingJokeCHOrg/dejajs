import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { DejaBackdropComponent  } from './index';

@NgModule({
    declarations: [DejaBackdropComponent],
    exports: [DejaBackdropComponent],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaBackdropModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { DejaBackdropModule } from '../backdrop/index';
import { DejaDropDownModule } from '../dropdown/index';
import { DejaMenuComponent  } from './index';

@NgModule({
    declarations: [DejaMenuComponent],
    exports: [DejaMenuComponent],
    imports: [
        CommonModule,
        FormsModule,
        DejaDropDownModule,
        DejaBackdropModule,
    ],
})
export class DejaMenuModule { }

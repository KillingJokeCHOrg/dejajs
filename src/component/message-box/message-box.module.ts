import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdIconModule } from '@angular/material';
import { DejaMessageBoxComponent } from './message-box.component';

@NgModule({
    declarations: [
        DejaMessageBoxComponent,
    ],
    exports: [
        DejaMessageBoxComponent,
    ],
    imports: [
        CommonModule,
        MdCardModule.forRoot(),
        MdIconModule.forRoot(),
        MdButtonModule.forRoot(),
    ],
})
export class DejaMessageBoxModule { }

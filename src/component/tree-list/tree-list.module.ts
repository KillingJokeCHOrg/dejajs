import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdCheckboxModule, MdInputModule } from '@angular/material';
import { DejaDragDropModule, DragDropService } from '../dragdrop';
import { DejaTreeListComponent } from "./";

@NgModule({
    declarations: [DejaTreeListComponent],
    exports: [DejaTreeListComponent],
    imports: [
        CommonModule,
        FormsModule,
        MdInputModule.forRoot(),
        MdCheckboxModule.forRoot(),
        DejaDragDropModule,
    ],
    providers: [DragDropService],
})
export class DejaTreeListModule { }

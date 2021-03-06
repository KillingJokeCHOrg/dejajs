import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { DejaSortingModule } from "../../common/core/sorting/index";
import { DejaDragDropModule } from '../dragdrop/dragdrop.module';
import { DejaTreeListModule } from '../tree-list/tree-list.module';
import { DejaGridComponent, DejaGridGroupAreaComponent, DejaGridHeaderComponent, DejaGridParentRowComponent, DejaGridRowComponent } from './index';

@NgModule({
    declarations: [
        DejaGridComponent,
        DejaGridRowComponent,
        DejaGridParentRowComponent,
        DejaGridHeaderComponent,
        DejaGridGroupAreaComponent,
    ],
    exports: [
        DejaGridComponent,
        DejaGridRowComponent,
        DejaGridParentRowComponent,
        DejaGridHeaderComponent,
        DejaGridGroupAreaComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DejaTreeListModule,
        DejaDragDropModule,
        DejaSortingModule,
    ],
})
export class DejaGridModule { 
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DejaGridModule,
            providers: [],
        };
    }
}

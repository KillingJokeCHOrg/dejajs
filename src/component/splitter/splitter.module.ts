/**
 * Created by rtr on 22.12.2016.
 */
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SplitAreaDirective } from "./split-area.directive";
import { SplitGutterDirective } from "./split-gutter.directive";
import { DejaSplitterComponent } from "./splitter.component";

@NgModule({
    declarations: [
        DejaSplitterComponent,
        SplitAreaDirective,
        SplitGutterDirective,
    ],
    exports: [
        DejaSplitterComponent,
        SplitAreaDirective,
        SplitGutterDirective,
    ],
    imports: [
        CommonModule,
    ],
})
export class DejaSplitterModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DejaSplitterModule,
            providers: [],
        };
    }
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DejaMonacoEditorComponent } from "./monaco-editor.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [DejaMonacoEditorComponent],
    declarations: [DejaMonacoEditorComponent],
})
export class DejaMonacoEditorModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DejaMonacoEditorModule,
            providers: [],
        };
    }
}

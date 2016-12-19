import { ApplicationRef, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule, MdListModule, MdProgressCircleModule, MdSidenavModule, MdSliderModule, MdToolbarModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { DejaAccordionDemo } from "./accordion/accordion-demo";
import { DejaCircularPickerDemo } from "./circular-picker/circular-picker-demo";
import { DejaColorSelectorDemo } from "./color-selector/color-selector-demo";
import { DejaContentEditableDemo } from "./content-editable/content-editable-demo";
import { DejaDatePickerDemo } from "./date-picker/date-picker-demo";
import { DemoApp } from "./demo-app/demo-app";
import { Home } from "./demo-app/home-app";
import { routing } from "./demo-app/routes";
import { GlobalEventsDemo } from "./global-events/global-events-demo";
import { GridDemo } from "./grid/grid-demo";
import { MenuDemo } from "./menu/menu-demo";
import { MessageBoxDemo } from "./message-box/message-box-demo";
import { DejaMonacoEditorDemo } from "./monaco-editor/monaco-editor-demo";
import { DejaRangeDemo } from './range/range-demo';
import { ScaleDemo } from "./scale/scale-demo";
import { SelectDemo } from "./select/select-demo";
import { CountriesListService } from "./services/countries-list.service";
import { CountriesService } from "./services/countries.service";
import { DrugsService } from "./services/drugs.service";
import { DejaSnackbarDemo } from "./snackbar/snackbar-demo";
import { TextAreaDemo } from "./textarea/textarea-demo";
import { TilesDemo } from "./tiles/tiles-demo";
import { DejaTreeListDemo } from "./tree-list/tree-list-demo";

import { GroupingModule } from "../common/core/grouping/index";
import { DejaSortingModule } from "../common/core/sorting/index";
import { MaterialColors } from "../common/core/style/index";
import { GlobalEventService } from "../common/global-event/global-event.service";
import {
    DejaAccordionModule,
    DejaAutosizeTextAreaModule,
    DejaBackdropModule,
    DejaBoldQueryModule,
    DejaCircularPickerModule,
    DejaColorPickerModule,
    DejaColorSelectorModule,
    DejaDatePickerModule,
    DejaDateSelectorModule,
    DejaDragDropModule,
    DejaEditableModule,
    DejaGridModule,
    DejaMenuModule,
    DejaMessageBoxModule,
    DejaMonacoEditorModule,
    DejaRangeModule,
    DejaScaleModule,
    DejaSelectModule,
    DejaSnackbarModule,
    DejaTilesModule,
    DejaTreeListModule,
} from "../component";

import { MonacoEditorDemoService } from "./monaco-editor/monaco-editor-demo.service.";
import { MonacoEditorJsonFileResolver, MonacoEditorJsonToCompareFileResolver, MonacoEditorXmlFileResolver, MonacoEditorXmlToCompareFileResolver } from "./monaco-editor/monaco-editor.resolver";
import { ProgressCircleDemo } from "./progress-circle/progress-circle-demo";

@NgModule({
    declarations: [
        DejaAccordionDemo,
        DejaContentEditableDemo,
        DejaCircularPickerDemo,
        DejaDatePickerDemo,
        DejaColorSelectorDemo,
        DemoApp,
        GlobalEventsDemo,
        GridDemo,
        Home,
        MenuDemo,
        MessageBoxDemo,
        ScaleDemo,
        SelectDemo,
        TilesDemo,
        TextAreaDemo,
        DejaTreeListDemo,
        DejaMonacoEditorDemo,
        DejaSnackbarDemo,
        DejaRangeDemo,
        ProgressCircleDemo,
    ],
    entryComponents: [
        DemoApp,
    ],
    imports: [
        DejaAccordionModule,
        BrowserModule,
        DejaCircularPickerModule,
        DejaDateSelectorModule,
        DejaDatePickerModule,
        FormsModule,
        HttpModule,
        RouterModule,
        MdToolbarModule.forRoot(),
        MdInputModule.forRoot(),
        MdProgressCircleModule.forRoot(),
        MdButtonModule.forRoot(),
        MdIconModule.forRoot(),
        MdSidenavModule.forRoot(),
        MdCardModule.forRoot(),
        MdCheckboxModule.forRoot(),
        MdListModule.forRoot(),
        MdSliderModule.forRoot(),
        DejaScaleModule,
        DejaSelectModule.forRoot(),
        DejaTreeListModule,
        DejaTilesModule,
        DejaColorSelectorModule,
        DejaColorPickerModule,
        DejaBoldQueryModule,
        DejaMenuModule,
        DejaMessageBoxModule,
        DejaEditableModule,
        DejaDragDropModule,
        DejaBackdropModule,
        DejaGridModule,
        DejaSortingModule,
        DejaAutosizeTextAreaModule,
        DejaMonacoEditorModule,
        DejaSnackbarModule,
        DejaRangeModule,
        routing,
        GroupingModule,
    ],
    providers: [
        CountriesService,
        CountriesListService,
        GlobalEventService,
        MaterialColors,
        DrugsService,
        MonacoEditorXmlFileResolver,
        MonacoEditorXmlToCompareFileResolver,
        MonacoEditorJsonFileResolver,
        MonacoEditorJsonToCompareFileResolver,
        MonacoEditorDemoService,
    ],
})
export class DemoAppModule {
    constructor(private appRef: ApplicationRef) { }

    protected ngDoBootstrap() {
        this.appRef.bootstrap(DemoApp);
    }
}

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './demo-app';
import { DejaAccordionDemo } from '../accordion/accordion-demo';
import { DejaContentEditableDemo } from '../content-editable/content-editable-demo';
import { DejaDatePickerDemo } from '../date-picker/date-picker-demo';
import { DejaCircularPickerDemo } from '../circular-picker/circular-picker-demo';
import { ScaleDemo } from '../scale/scale-demo';
import { SelectDemo } from '../select/select-demo';
import { DejaTreeListDemo } from '../tree-list/tree-list-demo';
import { GridDemo } from '../grid/grid-demo';
import { TilesDemo } from '../tiles/tiles-demo';
import { TextAreaDemo } from '../textarea/textarea-demo';
import { DejaColorSelectorDemo } from '../color-selector/color-selector-demo';
import { MenuDemo } from '../menu/menu-demo';
import { GlobalEventsDemo } from '../global-events/global-events-demo';
import { DejaMonacoEditorDemo} from "../monaco-editor/monaco-editor-demo";
import { MessageBoxDemo } from "../message-box/message-box-demo";
import { MonacoEditorXmlFileResolver, MonacoEditorXmlToCompareFileResolver, MonacoEditorJsonFileResolver, MonacoEditorJsonToCompareFileResolver} from "../monaco-editor/monaco-editor.resolver";
import { DejaSnackbarDemo} from "../snackbar/snackbar-demo";
import { DejaRangeDemo} from "../range/range-demo";
import { ProgressCircleDemo } from "../progress-circle/progress-circle-demo";

const routes: Routes = [
    { path: '', component: Home },
    { path: 'accordion', component: DejaAccordionDemo },
    { path: 'circular-picker', component: DejaCircularPickerDemo },
    { path: 'colorselector', component: DejaColorSelectorDemo },
    { path: 'contenteditableselector', component: DejaContentEditableDemo },
    { path: 'date-picker', component: DejaDatePickerDemo },
    { path: 'events', component: GlobalEventsDemo },
    { path: 'grid', component: GridDemo },
    { path: 'menu', component: MenuDemo },
    { path: 'message-box', component: MessageBoxDemo },
    { path: 'scale', component: ScaleDemo },
    { path: 'select', component: SelectDemo },
    { path: 'textarea', component: TextAreaDemo },
    { path: 'tiles', component: TilesDemo },
    { path: 'tree-list', component: DejaTreeListDemo },
    { path: 'progress-circle', component: ProgressCircleDemo },
    { path: 'monaco-editor', component: DejaMonacoEditorDemo, resolve: {
        xmlFile: MonacoEditorXmlFileResolver,
        xmlToCompareFile: MonacoEditorXmlToCompareFileResolver,
        jsonFile: MonacoEditorJsonFileResolver,
        jsonToCompareFile: MonacoEditorJsonToCompareFileResolver,
    }},
    { path: 'snackbar', component: DejaSnackbarDemo },
    { path: 'range', component: DejaRangeDemo },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

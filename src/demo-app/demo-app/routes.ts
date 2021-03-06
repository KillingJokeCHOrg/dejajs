import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DejaAccordionDemo } from '../accordion/accordion-demo';
import { DejaCircularPickerDemo } from '../circular-picker/circular-picker-demo';
import { DejaColorSelectorDemo } from '../color-selector/color-selector-demo';
import { DejaContentEditableDemo } from '../content-editable/content-editable-demo';
import { DejaDatePickerDemo } from '../date-picker/date-picker-demo';
import { GlobalEventsDemo } from '../global-events/global-events-demo';
import { GridDemo } from '../grid/grid-demo';
import { MenuDemo } from '../menu/menu-demo';
import { MessageBoxDemo } from "../message-box/message-box-demo";
import { DejaMonacoEditorDemo} from "../monaco-editor/monaco-editor-demo";
import { MonacoEditorJsonFileResolver, MonacoEditorJsonToCompareFileResolver, MonacoEditorXmlFileResolver, MonacoEditorXmlToCompareFileResolver} from "../monaco-editor/monaco-editor.resolver";
import { ProgressCircleDemo } from "../progress-circle/progress-circle-demo";
import { DejaRangeDemo} from "../range/range-demo";
import { ScaleDemo } from '../scale/scale-demo';
import { SelectDemo } from '../select/select-demo';
import { DejaSnackbarDemo} from "../snackbar/snackbar-demo";
import { TextAreaDemo } from '../textarea/textarea-demo';
import { TilesDemo } from '../tiles/tiles-demo';
import { DejaTreeListDemo } from '../tree-list/tree-list-demo';
import { Home } from './home-app';
import {DejaSplitterDemo} from "../splitter/splitter-demo";

const routes: Routes = [
    { component: Home, path: '' },
    { component: DejaAccordionDemo, path: 'accordion' },
    { component: DejaCircularPickerDemo, path: 'circular-picker' },
    { component: DejaColorSelectorDemo, path: 'colorselector' },
    { component: DejaContentEditableDemo, path: 'contenteditableselector' },
    { component: DejaDatePickerDemo, path: 'date-picker' },
    { component: GlobalEventsDemo, path: 'events' },
    { component: GridDemo, path: 'grid' },
    { component: MenuDemo, path: 'menu' },
    { component: MessageBoxDemo, path: 'message-box' },
    { component: ScaleDemo, path: 'scale' },
    { component: SelectDemo, path: 'select' },
    { component: TextAreaDemo, path: 'textarea' },
    { component: TilesDemo, path: 'tiles' },
    { component: DejaTreeListDemo, path: 'tree-list' },
    { component: ProgressCircleDemo, path: 'progress-circle' },
    { component: DejaMonacoEditorDemo, path: 'monaco-editor', resolve: {
        jsonFile: MonacoEditorJsonFileResolver,
        jsonToCompareFile: MonacoEditorJsonToCompareFileResolver,
        xmlFile: MonacoEditorXmlFileResolver,
        xmlToCompareFile: MonacoEditorXmlToCompareFileResolver,
    }},
    { component: DejaSnackbarDemo, path: 'snackbar' },
    { component: DejaRangeDemo, path: 'range' },
{ component: DejaSplitterDemo, path: 'splitter' },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

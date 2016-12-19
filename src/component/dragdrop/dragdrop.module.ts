import { NgModule } from '@angular/core';

import { DejaDraggableDirective, DejaDroppableDirective, DragDropService }   from './index';

@NgModule({
    declarations: [DejaDraggableDirective, DejaDroppableDirective],
    exports: [DejaDraggableDirective, DejaDroppableDirective],
    imports: [],
    providers: [DragDropService],
})
export class DejaDragDropModule {}

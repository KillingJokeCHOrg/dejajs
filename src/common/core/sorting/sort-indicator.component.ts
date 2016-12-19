import { Component, Input } from '@angular/core';
import { ISortInfos } from "./index";

@Component({
    selector: 'deja-sort-indicator',
    styleUrls: [ './sort-indicator.component.scss' ],
    template: `<span [attr.sortorder]="sortInfos ? sortInfos.order : null"></span>`,
})
export class DejaSortIndicatorComponent {
    @Input('sort-infos') public sortInfos: ISortInfos;
}

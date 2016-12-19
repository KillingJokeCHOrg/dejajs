import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { clearTimeout, setTimeout } from 'timers';
import { BooleanFieldValue } from '../../common/core/annotations';
import { Color } from '../../common/core/graphics/color';
import { DejaEditableDirective } from '../content-editable';
import { IDejaTile } from './';

@Component({
    selector: 'deja-tile-group',
    styleUrls: [
        './tile-group.component.scss',
    ],
    templateUrl: './tile-group.component.html',
})
export class DejaTileGroupComponent {
    @Input() public model: IDejaTile;
    @Input() @BooleanFieldValue() public designMode = false;
    @Output() public onClose = new EventEmitter();
    @Output() public onEdit = new EventEmitter();

    @Input() public set color(color: string) {
        let colorObj = Color.fromHex(color);
        if (colorObj.isEmpty()) {
            return;
        }
        this.backcolor = colorObj.toHex();
        this.forecolor = colorObj.bestTextColor.toHex();
    }

    @ViewChild(DejaEditableDirective) private title: DejaEditableDirective;

    private backcolor = '#3B4250';
    private forecolor = '#fff';

    constructor() {
    }

    protected edit() {
        setTimeout(() => {
            this.title.edit();
        }, 100);
    }
}

import {Component} from '@angular/core';
import { Color, ColorEvent } from '../../common/core/graphics';
import {MaterialColors} from '../../common/core/style';

@Component({
    selector: 'deja-color-selector-demo',
    styleUrls: ['./color-selector-demo.scss'],
    templateUrl: './color-selector-demo.html',
})
export class DejaColorSelectorDemo {
    private selectedColor = Color.fromHex('#ef5350');
    private hoveredColor: string;

    constructor(private materialColors: MaterialColors) { }

    protected onColorPickerHover(event: ColorEvent) {
        this.hoveredColor = event.colorName;
    }

    protected onColorPickerChange(event: ColorEvent) {
        this.hoveredColor = event.colorName;
    }
}

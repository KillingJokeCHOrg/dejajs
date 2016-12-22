/**
 * Created by rtr on 22.12.2016.
 */
import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer } from '@angular/core';
import { DejaSplitterComponent } from './splitter.component';

@Directive({
    host: {
        '[style.flex-grow]': '"0"',
        '[style.flex-shrink]': '"0"',
        '[style.height]': '"100%"',
        '[style.overflow-x]': '"hidden"',
        '[style.overflow-y]': '"auto"',
    },
    selector: 'split-area',
})
export class SplitAreaDirective implements OnInit, OnDestroy {

    private _order: number | null = null;
    @Input() set order(v: number) {
        this._order = !isNaN(v) ? v : null;
        this.split.updateArea(this, this._order, this._size, this._minSizePixel);
    }

    private _size: number | null = null;
    @Input() set size(v: any) {
        this._size = !isNaN(v) ? v : null;
        this.split.updateArea(this, this._order, this._size, this._minSizePixel);
    }

    private _minSizePixel: number = 0;
    @Input() set minSizePixel(v: number) {
        this._minSizePixel = (!isNaN(v) && v > 0) ? v : 0;
        this.split.updateArea(this, this._order, this._size, this._minSizePixel);
    }

    eventsLockFct: Array<Function> = [];

    constructor(private elementRef: ElementRef,
                private renderer: Renderer,
                private split: DejaSplitterComponent) {}

    public ngOnInit() {
        this.split.addArea(this, this._order, this._size, this._minSizePixel);
    }


    public lockEvents() {
        this.eventsLockFct.push( this.renderer.listen(this.elementRef.nativeElement, 'selectstart', e => false) );
        this.eventsLockFct.push( this.renderer.listen(this.elementRef.nativeElement, 'dragstart', e => false) );
    }

    public unlockEvents() {
        while(this.eventsLockFct.length > 0) {
            const fct = this.eventsLockFct.pop();
            if(fct) {
                fct();
            }
        }
    }

    public setStyle(key: string, value: any) {
        this.renderer.setElementStyle(this.elementRef.nativeElement, key, value);
    }

    public ngOnDestroy() {
        this.split.removeArea(this);
    }
}
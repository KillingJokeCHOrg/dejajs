import { Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { BooleanFieldValue } from '../../common/core/annotations';
import { IRange, IRangeEvent, IStepRangeEvent } from './range.interface';

// TODO Forcer la valeur min a la valeur de la step

/**
 * a multiple variable range component
 * let the user:
 *    define ranges at runtime using ngModel
 *    add, remove and edit range in a declarative fashion
 *    set the component to edit / read only mode
 *    this component is not tributary of it's view representation, read scss file for details
 * 
 * @export
 * @class DejaRangeComponent
 * @implements {ControlValueAccessor}
 */
@Component({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DejaRangeComponent),
    }],
    selector: 'deja-range',
    styleUrls: ['./range.component.scss'],
    templateUrl: './range.component.html',
})
export class DejaRangeComponent implements ControlValueAccessor {

    /**
     * set the component in edit / read only mode
     * 
     * @type {boolean}
     * @memberOf DejaRangeComponent
     */
    @Input() @BooleanFieldValue() public readOnly: boolean = true;

    /**
     * TODO step between each value of a range
     * 
     * @type {number}
     * @memberOf DejaRangeComponent
     */
    @Input() public step: number | number[] | ((e: IStepRangeEvent) => number) = 1;

    /**
     * index of the selected range
     * 
     * @type {number}
     * @memberOf DejaRangeComponent
     */
    @Input() public selected: number = 0;

    /**
     * emit the selected range
     * 
     * @type {EventEmitter<IRangeEvent>}
     * @memberOf DejaRangeComponent
     */
    @Output() public select: EventEmitter<{}> = new EventEmitter();

    /**
     * emit errors when forbiden action are performed
     * 
     * @type {EventEmitter<any>}
     * @memberOf DejaRangeComponent
     */
    @Output() public errorFeedback: EventEmitter<any> = new EventEmitter();

    /**
     * used to do the same as ngModelChange when change is made inside tue component with writeValue instead of using the setter
     * 
     * @public
     * @type {EventEmitter<any>}
     * @memberOf DejaRangeComponent
     */
    @Output() public rangesChange: EventEmitter<any> = new EventEmitter();

    /**
     * range template
     * 
     * @protected
     * 
     * @memberOf DejaRangeComponent
     */
    @ContentChild('rangeTemplate') protected rangeTemplate;

    /**
     * separator template
     * 
     * @protected
     * 
     * @memberOf DejaRangeComponent
     */
    @ContentChild('separatorTemplate') protected separatorTemplate;

    /**
     * array of range, model for this component
     * 
     * @private
     * @type {IRange[]}
     * @memberOf DejaRangeComponent
     */
    private _ranges: IRange[];

    /**
     * minimum range percentage
     * 
     * @private
     * @type {number}
     * @memberOf DejaRangeComponent
     */
    private minimumRangePercentage: number = 0.01;

    constructor(
        private elementRef: ElementRef,
    ) {
    }

    /**
     * ControlValueAccessor implementation
     * ranges getter
     * 
     * @type {IRange[]}
     * @memberOf DejaRangeComponent
     */
    get ranges(): IRange[] {
        return this._ranges || [];
    }

    /**
     * ControlValueAccessor implementation
     * ranges setter
     * 
     * @memberOf DejaRangeComponent
     */
    set ranges(ranges: IRange[]) {
        if (!!ranges) {
            this.writeValue(ranges);
            this._onChangeCallback(ranges);
        }
    }

    /**
     * ControlValueAccessor implementation
     * write the new value
     * 
     * @param {IRange[]} value
     * 
     * @memberOf DejaRangeComponent
     */
    public writeValue(ranges: IRange[]): void {
        if (!!ranges && !!ranges.length) {
            const host = this.elementRef.nativeElement as HTMLElement;
            const hostWidth = host.getBoundingClientRect().width;
            const totalDifference = ranges[ranges.length - 1].max - ranges[0].min;

            this._ranges = ranges.map((range, index) => {
                // calculate new width
                const difference = ranges[index].max - ranges[index].min;
                const viewValue = this.getViewRelativeValue(difference, hostWidth, totalDifference);
                range.$width = +viewValue.toFixed(2);

                return range;
            });
        }
    }

    /**
     * ControlValueAccessor implementation
     * register onChangeCallback || noop
     * 
     * @param {*} fn
     * 
     * @memberOf DejaRangeComponent
     */
    public registerOnChange(fn: any): void {
        this._onChangeCallback = fn;
    }

    /**
     * ControlValueAccessor implementation
     * register onTouch || noop
     * 
     * @param {*} fn
     * 
     * @memberOf DejaRangeComponent
     */
    public registerOnTouched(fn: any): void {
        this._onTouchCallback = fn;
    }

    /**
     * split the actual selected range into two new range
     * this method is implemented to be template-friendly
     * 
     * @memberOf DejaRangeComponent
     */
    public add(): void {
        if (!this.readOnly) {
            const ranges = Array.from(this.ranges);
            const index = this.selected;
            const selected = ranges[index];
            const difference = selected.max - selected.min;
            const totalDifference = ranges[ranges.length - 1].max - ranges[0].min;

            const minimumViewDifference = this.minimumRangePercentage * 2;
            const modelDifferencePercentage = difference / totalDifference;
            const isViewDifferenceEnough = modelDifferencePercentage > minimumViewDifference;

            let newMax;
            let newRange;

            const selectedDifference = selected.max - selected.min;

            if (typeof this.step === 'number') {
                const isModelDifferenceEnough = difference >= this.step * 2;

                if (isViewDifferenceEnough && isModelDifferenceEnough) {
                    newMax = this.toStep(ranges, index, selectedDifference / 2);
                }
            } else {
                throw 'Invalid step type, you have to implement the add function yourself for the fn & array.';
            }

            // add a new range by splitting the selected one min and max by two
            newRange = Object.assign(
                {},
                selected,
                {
                    max: newMax,
                    min: selected.min,
                });
            selected.min = newMax;

            // split array in half excluding the selected range
            const leftSide = ranges.slice(0, index);
            const rightSide = ranges.length - 1 > index ? ranges.slice(index + 1) : [];
            // build new array with new range
            const newRanges = [...leftSide, newRange, selected, ...rightSide];
            this.ranges = newRanges;

        } else {
            const tooSmallDifferenceError = new Error('Range is too small to be splitted');
            this.errorFeedback.emit(tooSmallDifferenceError);
        }
    }
    /**
     * remove the selected range
     * this method is implemented to be template-friendly
     * 
     * @memberOf DejaRangeComponent
     */
    public remove(): void {
        if (!this.readOnly && this.ranges.length > 2) {
            const ranges = Array.from(this.ranges);
            const index = this.selected;

            this.ranges = ranges.filter((range, i) => index !== i);
            this.rangesChange.emit();
        }
    }

    /**
     * listen to window resize to recaculate each range width
     * 
     * @private
     * @param {any} event
     * 
     * @memberOf DejaRangeComponent
     */
    @HostListener('window:resize', ['$event']) private onResize(event) {
        this.setRangesWidth(this.ranges);
    }

    /**
     * TODO set the selected element index
     * 
     * @private
     * @param {number} index
     * 
     * @memberOf DejaRangeComponent
     */
    private onSelect(e: Event, index: number): void {
        if (this.selected !== index) {
            let event = e as IRangeEvent;
            event.range = this.ranges[index];
            event.index = index;
            event.ranges = this.ranges;
            this.select.emit(event);
            this.selected = index;
        }
    }

    /**
     * perform calculation of the new maximum of a range when it's upper separator is moved on the DOM
     * 
     * @private
     * @param {MouseEvent} $event
     * 
     * @memberOf DejaRangeComponent
     */
    private onMouseDown($event: MouseEvent, index: number): void {

        if (!this.readOnly) {
            const xStart = $event.x;
            const target = $event.target as HTMLElement;
            const ranges = this.ranges;
            // todo: ask serge if there's a clean way to prevent this from happening:
            // The mousedown event triggering the onSelect() method prevent correct update of the index
            // because it's still happening before an other type of event is rised...so we can't use the this.selected
            // and we are forced to pass the index as well as the event.
            const range = this.ranges[index];
            const rangeStart = range.max;

            // get the block HTMLElement (contains range HTMLElement & separator HTMLElement)  
            let parentElement = target.parentElement;
            while (!parentElement.classList.contains('block')) {
                parentElement = parentElement.parentElement;
            }
            const blockWidth = parentElement.getBoundingClientRect().width;

            const up$ = Observable
                .fromEvent(document, 'mouseup')
                .do(() => {
                    this._onChangeCallback(this._ranges);
                })
                .take(1);

            up$
                .subscribe();

            // observe mousemove until a mouse up event happen on the document
            Observable
                .fromEvent(document, 'mousemove')
                .takeUntil(up$)
                .map((event: MouseEvent) => ({ event: event, x: event.x }))
                .map((obj: { event: MouseEvent, x: number }) => ({ event: obj.event, xDifference: -(xStart - obj.x) }))
                .do((obj: { event: MouseEvent, xDifference: number }) => {
                    const { xDifference, event } = obj;

                    const nextRange = this.ranges[index + 1];

                    // compute total difference
                    const totalDifference = ranges[ranges.length - 1].max - ranges[0].min;

                    // calculate new width of the range, get host width
                    const newWidth = blockWidth + xDifference;
                    const host = this.elementRef.nativeElement as HTMLElement;
                    const hostWidth = host.getBoundingClientRect().width;

                    // compute new model value
                    const modelDifference = xDifference * totalDifference / hostWidth;
                    let newMax = rangeStart + modelDifference;

                    const minDifference = this.minimumRangePercentage * totalDifference;
                    const min = range.min + minDifference;
                    const max = nextRange.max - minDifference;

                    newMax = Math.min(newMax, max);
                    newMax = Math.max(newMax, min);
                    const newStepped = this.toStep(ranges, index, newMax);

                    nextRange.min = range.max = newStepped;

                    ranges[index] = range;
                    ranges[index + 1] = nextRange;
                    this.writeValue(ranges);
                })
                .subscribe();
        }
    }

    /**
     * ControlValueAccessor implementation
     * fn to be triggered on change
     * 
     * @private
     * 
     * @memberOf DejaRangeComponent
     */
    private _onChangeCallback: (_: any) => void = () => { };

    /**
     * ControlValueAccessor implementation
     * fn to be triggered on touch
     * 
     * @private
     * 
     * @memberOf DejaRangeComponent
     */
    private _onTouchCallback: () => void = () => { };

    /**
     * get the difference between it's max and min of a range from it's width in pixel
     * 
     * @private
     * @param {number} viewValue
     * @param {number} hostWidth
     * @param {number} totalDifference
     * @returns {number}
     * 
     * @memberOf DejaRangeComponent
     */
    private getModelRelativeValue(viewValue: number, hostWidth: number, totalDifference: number): number {
        const viewPercent = hostWidth / 100;
        const percent = viewValue / viewPercent;
        const modelValue = totalDifference * percent / 100;
        return modelValue;
    }

    /**
     * get the width in pixel of a range from difference between it's max and min
     * 
     * @private
     * @param {number} modelValue
     * @param {number} hostWidth
     * @param {number} totalDifference
     * @returns {number}
     * 
     * @memberOf DejaRangeComponent
     */
    private getViewRelativeValue(modelValue: number, hostWidth: number, totalDifference: number): number {
        const modelPercent = totalDifference / 100;
        const percent = modelValue / modelPercent;
        const viewValue = hostWidth * percent / 100;

        return viewValue;
    }

    /**
     * set each range width to difference between it's max and min
     * 
     * @private
     * @param {IRange[]} value
     * 
     * @memberOf DejaRangeComponent
     */
    private setRangesWidth(value: IRange[]): void {
        const host = this.elementRef.nativeElement as HTMLElement;
        const hostWidth = host.getBoundingClientRect().width;

        this.ranges = value.map((range, index) => {
            const difference = value[index].max - value[index].min;
            const totalDifference = value[value.length - 1].max - value[0].min;
            const viewValue = this.getViewRelativeValue(difference, hostWidth, totalDifference);
            range.$width = viewValue;
            return range;
        });
    }

    /**
     * rounds number to step
     * 
     * @private
     * @param {number} number
     * @returns {number}
     * 
     * @memberOf DejaRangeComponent
     */
    private toStep(ranges: IRange[], index: number, newMax: number): number {

        const range = ranges[index];
        const maybeNextIndex = ranges.length - 1 > index ? index + 1 : index;
        const nextMax = ranges[maybeNextIndex].max;
        const previousMax = index !== 0 ? ranges[index - 1].max : 0;

        const totalDifference = ranges[ranges.length - 1].max - ranges[0].min;
        const minimumViewDifference = this.minimumRangePercentage * totalDifference;

        const viewMin = range.min + minimumViewDifference;
        const viewMax = nextMax - minimumViewDifference;

        if (typeof this.step === 'number') {

            const numericStep = this.step as number;
            const precision = 100 / (numericStep * 100);
            const steppedValue = (Math.round(newMax * precision) / precision);

            const mantisseLength = numericStep
                .toString()
                .replace(/[0-9]+\./, '')
                .length;

            const fixedValue = +steppedValue.toFixed(mantisseLength);

            const modelMax = Math.min(fixedValue, nextMax - numericStep);
            const modelMin = Math.max(fixedValue, previousMax + numericStep);

            const min = viewMin < modelMin ? modelMin : viewMin;
            const max = viewMax > modelMax ? modelMax : viewMax;

            const bestValue = newMax > range.max ? max : min;

            return bestValue;


        } else if (typeof this.step === 'function') {
            let event = {} as IStepRangeEvent;

            event.range = this.ranges[index];
            event.index = index;
            event.ranges = this.ranges;
            event.newMax = newMax;

            return this.step(event);

        } else if (this.step instanceof Array) {
            let idealValue = newMax;
            let bestDiff: number;
            this.step
                .filter((value) => value <= viewMax && value >= viewMin)
                .forEach((value) => {
                    let diff = Math.abs(value - newMax);
                    if (bestDiff === undefined || bestDiff > diff) {
                        idealValue = value;
                        bestDiff = diff;
                    }
                });

            return idealValue;

        } else {
            throw 'Invalid step type.';
        }
    }

    /**
     * get the percentage of the range difference relative to the full range  
     * 
     * @private
     * @param {IRange[]} ranges
     * @param {number} index
     * @returns
     * 
     * @memberOf DejaRangeComponent
     */
    private getRelativePercentage(ranges: IRange[], index: number) {
        const range = ranges[index];
        const difference = range.max - range.min;
        const totalDifference = ranges[ranges.length - 1].max - ranges[0].min;
        const percentage = difference / totalDifference;

        return percentage;
    }
}

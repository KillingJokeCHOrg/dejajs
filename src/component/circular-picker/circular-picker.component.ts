import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {coerceBooleanProperty} from '@angular/material/core/coercion/boolean-property';
import { Observable, Subscription } from 'rxjs/Rx';
import { Circle, Position, Rect } from '../../common/core';

const noop = () => { };

const DejaCircularPickerComponentValueAccessor = {
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DejaCircularPickerComponent),
};

enum ClockwiseFactorEnum {
    clockwise = -1,
    counterClockwise = 1,
}

interface ICircularValue {
    position: Position;
    value: number;
}

@Component({
    providers: [DejaCircularPickerComponentValueAccessor],
    selector: 'deja-circular-picker',
    styleUrls: ['./circular-picker.component.scss'],
    templateUrl: './circular-picker.component.html',
})
export class DejaCircularPickerComponent implements OnInit {
    @Input() public clockwiseFactor: ClockwiseFactorEnum = ClockwiseFactorEnum.clockwise;
    @Input() public fullDiameter: number = 310;
    @Input() public labelsDiameter = 43;
    @Input() public outerLabels: boolean = false;
    @Input() public ranges: IRange[];
    @Input() public replaceValues: Array<{
        key: number,
        value: number,
    }>;

    @Input() 
    public set disabled(value: boolean) { 
        this._disabled = coerceBooleanProperty(value);
    }
    
    public get disabled() { 
        return this._disabled;
    }
    
    private _disabled = false;

    private _value: number;
    private TwoPI = Math.PI * 2;

    private radius: number = 0;
    private configs: IConfig[] = [];
    private selectedConfig: IConfig;

    private circularValues: ICircularValue[] = [];

    private cursor: ICircularValue;
    private cursorHand: { width: number, angle: number };
    private cursorElement: HTMLElement;

    private clickedTime: number;

    private mouseMoveObs: Subscription;

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    private circle: Circle;

    @ViewChild('picker') private picker: ElementRef;
    
    constructor(private elementRef: ElementRef) { }

    public ngOnInit() {
        let diameter = this.fullDiameter /* max - width */ - this.labelsDiameter /* Material standard button size */;
        this.radius = diameter / 2;

        this.ranges.forEach((range) => {
            range.interval = (range.interval) ? range.interval : 1;
            range.labelInterval = (range.labelInterval) ? range.labelInterval : 1;
            range.beginOffset = (range.beginOffset) ? range.beginOffset : Math.PI / 2;
            this.configs.push({
                range: range,
                stepAngle: this.TwoPI / Math.floor((range.max - range.min + 1) / range.interval),
                steps: Math.floor((range.max - range.min + 1) / range.interval),
            });
        });

        this.selectedConfig = this.configs[0];

        this.bind();
        this.updateCursor();
    }

    // ************* ControlValueAccessor Implementation **************
    // set accessor including call the onchange callback
    set value(v: number) {
        if (v !== this._value) {
            this.writeValue(v);
            this.onChangeCallback(v);
        }
    }

    // get accessor
    get value(): number {
        return this._value;
    }

    // From ControlValueAccessor interface
    public writeValue(value: number) {
        if (value !== this._value) {
            this._value = value;
            this.updateCursor();
        }
    }

    // From ControlValueAccessor interface
    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    // ************* End of ControlValueAccessor Implementation **************

    @HostListener('mousedown', ['$event'])
    protected onMouseDown(event: MouseEvent) {
        if (event.buttons !== 1) {
            return;
        }

        this.clickedTime = Date.now();
        let cursorElement = this.getHTMLElement(event.target as HTMLElement, 'cursor');
        let valueElement = this.getHTMLElement(event.target as HTMLElement, 'value');
        if (cursorElement) {
            this.cursorElement = cursorElement;
        } else if (valueElement) {
            this.value = +valueElement.getAttribute('value');
        }

        if (cursorElement || valueElement) {
            // Enable mouse observers
            this.mouseMove = true;
        }
    }

    protected pointToValue(x: number, y: number, config: IConfig): number {
        let angleAtPoint: number = this.pointToAngle(x - this.radius, y - this.radius, config);
        let circleSegmentIndexAtPoint: number = config.steps - Math.ceil(angleAtPoint / config.stepAngle);
        // By having pointToAngle() to compute using a half step below the actual angle, 
        // we can use Math.ceil() to get the upper circleSegmentIndex. We're working in 
        // counter-clockwise direction, thus we finally get a -1 index when we're just
        // below the first circle segment. We can now simply wrap it to the 0 index,
        // resulting in the user-expected behavior.
        if (circleSegmentIndexAtPoint < 0) {
            circleSegmentIndexAtPoint = config.steps;
        }
        return config.range.min + circleSegmentIndexAtPoint * config.range.interval;
    }

    protected valueToPoint(value: number, radiusOffset: number, config: IConfig): Position {
        let position = new Position();
        let valueAngle: number = this.valueToAngle(value, config);

        position.left = this.radius + (this.radius + radiusOffset) * Math.cos(valueAngle);
        position.top = this.radius - (this.radius + radiusOffset) * Math.sin(valueAngle); // y axis is reversed in display

        return position;
    }

    private pointToAngle(x: number, y: number, config: IConfig): number {
        return ( 
            -Math.atan2(y, x)		    // Math.atan2() returns between -Ï€ and +Ï€, but in inverted trigonometrical order...
            - config.range.beginOffset	// Correct the configured offset to compute in "natural" trigonometrical circle
            - (config.stepAngle / 2)	// Remove half a step angle to match value from both sides
            + this.TwoPI			    // We want the returned value to be between 0 and 2Ï€ => (x + 2Ï€) % 2Ï€
        ) % this.TwoPI;
    }

    private valueToAngle(value: number, config: IConfig): number {
        let circleSegmentIndex: number = Math.floor((value - config.range.min) / config.range.interval);
        return (circleSegmentIndex * config.stepAngle * this.clockwiseFactor) + config.range.beginOffset;
    }

    private bind() {
        this.circularValues = [];
        this.configs.forEach((config: IConfig, configNumber: number) => {
            for (let i = config.range.min; i <= config.range.max; i += (config.range.labelInterval * config.range.interval)) {
                let val = {} as ICircularValue;
                let find = (this.replaceValues) ? this.replaceValues.find((v) => v.key === i) : null;
                if (find) {
                    val.value = find.value;
                } else {
                    val.value = i;
                }

                let labelRadius = this.labelsDiameter / 2;
                let configOffset = this.labelsDiameter * configNumber;
                let labelPosition = this.valueToPoint(i, (this.outerLabels ? labelRadius + configOffset : -labelRadius - configOffset), config);

                val.position = new Position((labelPosition.left - labelRadius), (labelPosition.top - labelRadius));
                this.circularValues.push(val);
            }
        });
    }

    private updateCursor() {
        if (typeof this.value === 'undefined') {
            this.value = this.circularValues[0].value;
        }
        this.selectedConfig = this.configs.find((conf: IConfig) => {
            // Check if value is a replaced value before compare
            let find = (this.replaceValues) ? this.replaceValues.find((v) => v.value === this.value) : null;
            let val = (find) ? find.key : this.value;
            if (val >= conf.range.min && val <= conf.range.max) {
                return true;
            }
        });
        if (!this.selectedConfig) {
            this.selectedConfig = this.configs[0];
        }
        let selectedConfigIndex = this.configs.indexOf(this.selectedConfig);
        let cursorCenter: Position;
        let cursorRadius: number = this.labelsDiameter / 2;

        cursorCenter = this.valueToPoint(this.value, (this.outerLabels ? cursorRadius + (this.labelsDiameter * selectedConfigIndex) : -cursorRadius - (this.labelsDiameter * selectedConfigIndex)), this.selectedConfig);
        this.cursor = {
            position: new Position((cursorCenter.left - cursorRadius), (cursorCenter.top - cursorRadius)),
            value: this.value,
        };

        this.cursorHand = {
            angle: this.valueToAngle(this.value, this.selectedConfig),
            width: (this.outerLabels) ? this.radius + (this.labelsDiameter * selectedConfigIndex) : this.radius - this.labelsDiameter - (this.labelsDiameter * selectedConfigIndex),
        };
    }

    private getHTMLElement(element: HTMLElement, attr: string): HTMLElement {
        let parentElement = element;

        while (parentElement && !parentElement.hasAttribute(attr)) {
            element = parentElement;
            parentElement = parentElement.parentElement;
        }

        if (!parentElement) {
            return undefined;
        }

        return parentElement;
    }

    private set mouseMove(value: boolean) {
        let elem = this.elementRef.nativeElement as HTMLElement;
        if (value) {
            if (this.mouseMoveObs) {
                return;
            }
            if (!elem.ownerDocument.body.className.match(/noselect/)) {
                elem.ownerDocument.body.className += 'noselect';
            }

            this.mouseMoveObs = Observable.fromEvent(elem.ownerDocument, 'mousemove').subscribe((event: MouseEvent) => {
                if (event.buttons !== 1) {
                    // Mouse up
                    delete this.cursorElement;
                    delete this.clickedTime;
                    this.mouseMove = false;
                    return;
                }

                let pickerElem = this.picker.nativeElement as HTMLElement;
                let clientRect = pickerElem.getBoundingClientRect();

                this.circle = Circle.fromOuterRect(clientRect);
                let contains = false;
                if (this.outerLabels) {
                    this.circle = this.circle.inflate(this.labelsDiameter);

                    for (let i = 0; i < this.configs.length; i++) {
                        contains = this.circle.containsPoint(new Position(event.pageX, event.pageY));
                        if (contains) {
                            this.selectedConfig = this.configs[i];
                            break;
                        } else {
                            this.circle = this.circle.inflate(this.labelsDiameter);
                        }
                    }
                } else {
                    let x = this.labelsDiameter * (this.configs.length - 1);
                    this.circle = this.circle.inflate(-x);
                    for (let i = this.configs.length; i > 0 ; i--) {
                        contains = this.circle.containsPoint(new Position(event.pageX, event.pageY));
                        if (contains) {
                            this.selectedConfig = this.configs[i - 1];
                            break;
                        } else {
                            this.circle = this.circle.inflate(this.labelsDiameter);
                        }
                    }
                }

                let newValue = this.pointToValue(event.pageX - clientRect.left, event.pageY - clientRect.top, this.selectedConfig);
                let find = (this.replaceValues) ? this.replaceValues.find((v) => v.key === newValue) : null;
                if (find) {
                    newValue = find.value;
                }
                if (newValue !== this.value) {
                    this.value = newValue;
                }
            });
        } else if (this.mouseMoveObs) {
            elem.ownerDocument.body.className = elem.ownerDocument.body.className.replace(/\bnoselect\b/, '');
            this.mouseMoveObs.unsubscribe();
            delete this.mouseMoveObs;
        }
    }
}

interface IConfig {
    range: IRange; 
    steps: number;
    stepAngle: number;
}

interface IRange {
    min: number; 
    max: number; 
    interval?: number; 
    labelInterval?: number; // x*interval
    beginOffset?: number;
}

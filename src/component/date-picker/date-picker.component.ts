import { Component, OnInit, ViewChild, Input, Output, EventEmitter, forwardRef, ElementRef, ViewEncapsulation, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import 'rxjs/Rx';

import { DejaDateSelectorComponent, DaysOfWeek } from '../date-selector';
import { BooleanFieldValue } from '../../common/core/annotations';
import { MdInput } from '@angular/material';

const noop = () => { };

const DejaDatePickerComponentValueAccessor = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DejaDatePickerComponent),
    multi: true,
};

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'deja-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: [DejaDatePickerComponentValueAccessor],
})
export class DejaDatePickerComponent implements OnInit {

    @Input() @BooleanFieldValue() public disabled: boolean = false;
    @Input() @BooleanFieldValue() public time: boolean = false;
    @Input() public dateMax: Date;
    @Input() public dateMin: Date;
    @Input() public dropdownContainerId: string;
    @Input() public dropdownAlignment = 'left right top bottom';
    @Input() public ownerAlignment = 'left bottom';
    @Input() public format: string;
    @Input() public placeholder: string = 'Date';
    @Input() public disableDates: (DaysOfWeek | Date)[]; // | ((d: Date) => boolean);
    @ViewChild(DejaDateSelectorComponent) public dateSelectorComponent: DejaDateSelectorComponent;
    @ViewChild(MdInput) public inputDateElem: MdInput;
    @Output() public dateChange = new EventEmitter();

    @ContentChild('hintTemplate') protected mdHint;

    private _useDropDown = false;
    private keydown: Observable<{}>;
    private keyDownSubscription: Subscription;

    private date = new Date();

    private inputModel;

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(private elementRef: ElementRef) { }

    public ngOnInit() { }

    private get containerElement() {
        return this.dropdownContainerId && this.elementRef.nativeElement.ownerDocument.getElementById(this.dropdownContainerId);
    }

    private set useDropDown(value: boolean) {
        if (value !== this._useDropDown) {
            this._useDropDown = value;
            if (value) {
                this.keydown = Observable.fromEvent(this.inputDateElem._inputElement.nativeElement, 'keydown');
                this.keyDownSubscription = this.keydown.subscribe((event: KeyboardEvent) => {
                    this.dateSelectorComponent.keyboardNavigation = false;
                });
            } else {
                if (this.keyDownSubscription) {
                    this.keyDownSubscription.unsubscribe();
                    delete this.keyDownSubscription;
                }
            }
        }
    }

    private get useDropDown() {
        return this._useDropDown;
    }

     // ************* ControlValueAccessor Implementation **************
    // get accessor
    get value(): Date {
        return this.date;
    };

    // set accessor including call the onchange callback
    set value(v: Date) {
        if (v !== this.date) {
            this.writeValue(v);
            this.onChangeCallback(v);
        }
    }

    // From ControlValueAccessor interface
    public writeValue(value: Date) {
        if (value !== this.date) {
            this.date = value;
            this.inputModel = (this.format && this.date) ? moment(this.date).format(this.format) : (this.date) ? this.date.toLocaleString() : null;
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

    protected toggleDateSelector(event: Event) {
        if (this.disabled) { 
            return;
        }
        
        let target = event.currentTarget as HTMLElement;
        if (target.id !== 'deja-date-selector-input') {
            return;
        }

        this.useDropDown = !this.useDropDown;
        return false;
    }

    protected onDateChange(event: Date) {
        this.value = event;
    }

    protected close() {
        this.useDropDown = false;
    }

    protected updateModel(date: string | Date) {
        if (typeof date === 'string') {
            let d = new Date(date);
            if (!moment(d).isValid()) {
                // TODO : eventually throw error
                d = new Date();
            }
            date = d;
        }

        if (this.date.toLocaleTimeString() !== date.toLocaleTimeString()) {
            date.setHours(this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
        }
        this.value = date;
        this.close();
    }

    protected reset(event: MouseEvent) {
        this.value = undefined;
        delete this.inputModel;
        this.onChangeCallback(this.value);
        this.close();
    }
}

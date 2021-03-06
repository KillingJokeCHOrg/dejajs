import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

function validateDateFactory(dateMin, dateMax) {
   return (c: FormControl) => {
        let bad = {
            invalideDate: true,
        };

        let now = new Date();

        if (!c.value) {
            return bad;
        } else if (dateMin && c.value.getTime() < now.getTime()) {
            return bad;
        } else if (dateMax && c.value.getTime() > now.getTime()) {
            return bad;
        }
        return null;
    };
}

@Directive({
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidator), multi: true },
    ],
    selector: '[date-validator][ngModel]',
})
export class DateValidator implements OnInit {
    @Input() public dateMin: Date;
    @Input() public dateMax: Date;

    private validator: Function;

    constructor() {
    }

    public ngOnInit() {
        this.validator = validateDateFactory(this.dateMin, this.dateMax);
    }

    public validate(c: FormControl) {
        return this.validator(c);
    }
}

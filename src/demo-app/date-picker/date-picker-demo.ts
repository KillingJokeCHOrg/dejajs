import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dejadate-picker-demo',
    styleUrls: ['./date-picker-demo.scss'],
    templateUrl: './date-picker-demo.html',
})
export class DejaDatePickerDemo implements OnInit {
    public theDate = new Date();
    public disabledDate = [0, 6, new Date(2016, 9, 12)];

    constructor() { }

    public ngOnInit() { 
        
    }
}

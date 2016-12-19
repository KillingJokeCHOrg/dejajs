import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dejadate-picker-demo',
    styleUrls: ['./date-picker-demo.scss'],
    templateUrl: './date-picker-demo.html',
})
export class DejaDatePickerDemo implements OnInit {
    public toto = new Date();
    public tutu = 3;
    public test = [0, 6, new Date(2016, 9, 12)];

    constructor() { }

    public ngOnInit() { 
        
    }
}

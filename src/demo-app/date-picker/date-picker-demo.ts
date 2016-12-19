import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dejadate-picker-demo',
    templateUrl: './date-picker-demo.html',
    styleUrls: ['./date-picker-demo.scss'],
})
export class DejaDatePickerDemo implements OnInit {
    public toto = new Date();
    public tutu = 3;
    public test = [0, 6, new Date(2016, 9, 12)];

    constructor() { }

    public ngOnInit() { 
        
    }
}

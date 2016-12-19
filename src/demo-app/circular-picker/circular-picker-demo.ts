import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'deja-circular-picker-demo',
    templateUrl: './circular-picker-demo.html',
    styleUrls: ['./circular-picker-demo.scss'],
})
export class DejaCircularPickerDemo implements OnInit {
    public tutu = 3;
    protected ranges1 = [
        {min: 1, max: 20, labelInterval: 2},
    ];
    protected ranges2 = [
        {min: 1, max: 20},
    ];
    protected ranges3 = [
        {min: 1, max: 12, beginOffset: Math.PI / 3},
        {min: 13, max: 24, beginOffset: Math.PI / 3},
    ];
    protected replaceValues = [
        {key: 24, value: 0},
    ];

    constructor() { }

    public ngOnInit() { 
        
    }
}

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'demo-app',
    styleUrls: ['./demo-app.scss', '../../scss/index.scss'],
    templateUrl: './demo-app.html',
})
export class DemoApp {
    public version: string;

    constructor() {
    }

    get debug() {
        // console.log('Binding ' + Date.now());
        return null;
    }
}

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'home',
    template: `
    <p>Welcome to the development demos for deja-angular2</p>
    <p>Open the sidenav to select a demo. </p>
  `,
})
export class Home { }

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

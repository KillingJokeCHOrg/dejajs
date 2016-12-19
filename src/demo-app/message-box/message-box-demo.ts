import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'message-box-demo',
    styleUrls: ['./message-box-demo.scss'],
    templateUrl: './message-box-demo.html',
})
export class MessageBoxDemo implements OnInit {

    protected actions = [
        {
            action: () => alert('test action'),
            text: 'test avec icon',
            type: 'primary',
        },
        {
            action: () => alert('test action'),
            text: 'test sans icon',
        },
        {
            action: () => alert('test action'),
            type: 'danger',
        },
    ];

    protected closeAction = [
        {
            action: () => alert('test action'),
            icon: 'clear',
        },
    ];

    /*
    The example below demonstrate how you can dynamically add snackbars using *ngFor structural directive.
    Here the Observable simulate items being push from the server
    */
    private messages: Observable<any>;

    constructor() { }

    public ngOnInit() {
        this.messages = Observable
            .interval(2000)
            .map((x: number) => {
                if(x % 2 === 0 ) {
                    return new Message('Server push information', 'info'); 
                } else {
                    return new Message('Server push error', 'danger'); 
                }
            })
            .scan((acc, curr) => [...acc, curr], [])
            .defaultIfEmpty([]);
    }

}

class Message {
    constructor(public content: string = `Some information`, public type:string = 'info', public gate: boolean = true) { }
}

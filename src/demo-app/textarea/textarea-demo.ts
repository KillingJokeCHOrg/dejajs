import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'textarea-demo',
    templateUrl: './textarea-demo.html',
    styleUrls: ['./textarea-demo.scss'],
})
export class TextAreaDemo implements OnInit {
    protected multitext = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
                        Mauris auctor sit amet odio et aliquet. Curabitur auctor eleifend mattis. <br />
                        Nullam sit amet quam tellus. Ut mattis tellus sed erat ultricies ornare. <br />
                        Nulla dictum nisi eu tortor lacinia porttitor. Donec eu arcu et enim cursus viverra. <br />
                        Praesent pulvinar dui nisi, a tincidunt arcu finibus sed.`;

    protected multitext2: string;

    constructor() { }

    public ngOnInit() { 
        
    }
}

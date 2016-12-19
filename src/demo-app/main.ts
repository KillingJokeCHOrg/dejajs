import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GlobalEventEmmitter } from '../../src/common/global-event/global-event-emmitter';
import { DemoAppModule } from './demo-app-module';

setInterval(
    () => {
        if (typeof GlobalEventEmmitter === 'function') {
            GlobalEventEmmitter.instance.emit('sendaction', [new Date().getTime(), 'This is a date']);
        }
    }, 1000);

// enableProdMode();
platformBrowserDynamic().bootstrapModule(DemoAppModule);

import { Component, NgZone, OnInit } from '@angular/core';
import { GlobalEventService } from '../../common/global-event/global-event.service';

@Component({
  selector: 'events-demo',
  styleUrls: ['./global-events-demo.scss'],
  templateUrl: './global-events-demo.html',
})
export class GlobalEventsDemo implements OnInit {
  private model = {
    date: new Date(),
  };
  private _subscription: any;

  constructor(private globalEvent: GlobalEventService, private zone: NgZone) {
  }

  public ngOnInit() {
    this._subscription = this.globalEvent.register('sendaction').subscribe((params: any[]) => {
      this.zone.run(() => {
        this.model.date = new Date(params[0]);
      });
    });
  }

  protected ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}

import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MaterialColors } from '../../common/core/style/material-colors';
import { Message } from './message.class';

@Component({
  selector: 'deja-snackbar-demo',
  styleUrls: ['./snackbar-demo.scss'],
  templateUrl: './snackbar-demo.html',
})
export class DejaSnackbarDemo implements OnInit {
  /*
  The example below demonstrate how you can dynamically add snackbars using *ngFor structural directive.
  Here the Observable simulate items being push from the server
  */
  private messages: Observable<any>;

  private dangers: Observable<any>;
  private warnings: Observable<any>;
  private successes: Observable<any>;
  private infos: Observable<any>;

  private push = new EventEmitter();

  private colors: any;
  private danger: string;
  private warning: string;
  private success: string;
  private info: string;
  private default: string;

  public ngOnInit() {
    this.colors = new MaterialColors()['palet'];
    this.danger = this.colors['md-red']['500'];
    this.warning = this.colors['md-orange']['500'];
    this.success = this.colors['md-green']['500'];
    this.info = this.colors['md-blue']['500'];
    this.default = this.colors['md-grey']['900'];

    this.dangers = Observable
      .from(this.push)
      .filter((type: string) => type === 'danger')
      .map((event: Event) => new Message('Danger snackbar'))
      .scan((acc, curr) => [...acc, curr], [])
      .defaultIfEmpty([]);

    this.warnings = Observable
      .from(this.push)
      .filter((type: string) => type === 'warning')
      .map((event: Event) => new Message('Warning snackbar'))
      .scan((acc, curr) => [...acc, curr], [])
      .defaultIfEmpty([]);

    this.successes = Observable
      .from(this.push)
      .filter((type: string) => type === 'success')
      .map((event: Event) => new Message('Success snackbar'))
      .scan((acc, curr) => [...acc, curr], [])
      .defaultIfEmpty([]);

    this.infos = Observable
      .from(this.push)
      .filter((type: string) => type === 'info')
      .map((event: Event) => new Message('Info snackbar'))
      .scan((acc, curr) => [...acc, curr], [])
      .defaultIfEmpty([]);

    this.messages = Observable
      .interval(2000)
      .map((x: number) => new Message('Server push snackbar'))
      .scan((acc, curr) => [...acc, curr], [])
      .defaultIfEmpty([]);
  }
}

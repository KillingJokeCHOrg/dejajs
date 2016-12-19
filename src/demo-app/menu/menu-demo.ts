import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'deja-menu-demo',
  templateUrl: './menu-demo.html',
  styleUrls: ['./menu-demo.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuDemo {
  public selected = '';
  public items = [
    {text: 'Refresh'},
    {text: 'Settings'},
    {text: 'Help', disabled: true},
    {text: 'Sign Out'},
  ];

  public select(text: string) { this.selected = text; }
}

import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'deja-menu-demo',
  styleUrls: ['./menu-demo.scss'],
  templateUrl: './menu-demo.html',
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

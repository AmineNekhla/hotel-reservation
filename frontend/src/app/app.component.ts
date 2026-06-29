import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: [`
    * { box-sizing: border-box; font-family: Arial, sans-serif; }
    body { margin: 0; background: #f9f9f9; }
  `]
})
export class AppComponent {
  title = 'Hotel Reservation';
}

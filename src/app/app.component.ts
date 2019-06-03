import { Component } from '@angular/core';

@Component({
  selector: 'ch24-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  items = Array.from({ length: 1000 })
    .map((_, i) => ({ key: i, label: `Item longer that expected #${i}` }));
}

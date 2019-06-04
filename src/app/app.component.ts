import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'ch24-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      sel1: new FormControl({ key: 50, label: `Item #50` }),
      sel2: new FormControl({ key: 60, label: `Item #60` }),
    });

    this.form.valueChanges.pipe(untilDestroyed(this))
      .subscribe(val => console.log('FormValue', val));
  }

  items = Array.from({ length: 100 })
    .map((_, i) => ({ key: i, label: `Item #${i}` }));

  ngOnDestroy(): void {
  }

}

import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ch24DisableControl]'
})
export class DisableControlDirective {

  @Input() set ch24DisableControl(condition: boolean) {
    condition ? this.ngControl.control.disable() : this.ngControl.control.enable();
  }

  constructor(private ngControl: NgControl) {
  }

}

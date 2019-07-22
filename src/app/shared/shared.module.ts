import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownMenuItemComponent } from './components/dropdown/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuComponent } from './components/dropdown/dropdown-menu/dropdown-menu.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DisableControlDirective } from './directives/disable-control.directive';

const MODULES = [
  CommonModule,
  BrowserAnimationsModule,
  FormsModule,
  ReactiveFormsModule,
];

const COMPONENTS = [
  DropdownComponent,
  DropdownMenuComponent,
  DropdownMenuItemComponent,
  DisableControlDirective
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
  ],
})
export class SharedModule {}

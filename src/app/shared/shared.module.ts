import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownMenuComponent } from './components/dropdown/dropdown-menu/dropdown-menu.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

const MODULES = [
  CommonModule,
  BrowserAnimationsModule,
  FormsModule,
  ReactiveFormsModule,
];

const COMPONENTS = [
  DropdownComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    DropdownMenuComponent
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

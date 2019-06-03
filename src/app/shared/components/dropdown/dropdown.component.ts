import { Component, Input, OnInit } from '@angular/core';
import { ListItem } from './model';

@Component({
  selector: 'ch24-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {

  @Input() items: ListItem<any>[] = [];
  @Input() placeholder: string;

  selectedItem: ListItem<any> = null;
  isOpen = false;

  constructor() { }

  ngOnInit() {
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

}

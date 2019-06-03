import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ListItem } from './model';

@Component({
  selector: 'ch24-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {

  @Input() items: ListItem<any>[] = [];
  @Input() placeholder: string;
  @Input() itemTemplate: TemplateRef<any>;

  @Output() selected = new EventEmitter<ListItem<any>>();

  protected _selectedItem: ListItem<any> = null;
  protected _isOpen = false;

  constructor() { }

  ngOnInit() {
  }

  public get isOpen() {
    return this._isOpen;
  }

  public toggle() {
    this._isOpen = !this.isOpen;
  }

  public open() {
    this._isOpen = true;
  }

  public close() {
    this._isOpen = false;
  }

  onSelected(item) {
    this._selectedItem = item;
    this.selected.emit(item);
    this.close();
  }

}

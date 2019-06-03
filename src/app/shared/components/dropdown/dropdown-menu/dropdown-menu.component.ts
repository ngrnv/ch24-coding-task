import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ListItem } from 'src/app/shared/components/dropdown/model';

@Component({
  selector: 'ch24-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
})
export class DropdownMenuComponent implements OnInit {

  @Input() items: ListItem<any>[] = [];
  @Input() itemTemplate: TemplateRef<any>;

  @Output() selected = new EventEmitter<ListItem<any>>();

  constructor() { }

  ngOnInit() {
  }

  onSelected(item: ListItem<any>) {
    this.selected.emit(item);
  }

}

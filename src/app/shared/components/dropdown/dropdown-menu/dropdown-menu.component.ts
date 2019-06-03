import {
  ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, TemplateRef, ViewChildren,
} from '@angular/core';
import { ListItem } from 'src/app/shared/components/dropdown/model';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';

@Component({
  selector: 'ch24-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuComponent implements OnInit {

  @Input() items: ListItem<any>[] = [];
  @Input() itemTemplate: TemplateRef<any>;

  @Output() selected = new EventEmitter<ListItem<any>>();
  @Output() keyPressed = new EventEmitter<number>();

  @ViewChildren(DropdownMenuItemComponent) menuItems: QueryList<DropdownMenuItemComponent>;

  private _focusedItem: DropdownMenuItemComponent;
  public set focusedItem(item) {
    this._focusedItem = item;
    this._focusedItem.elem.nativeElement.focus();
    this._focusedItem.elem.nativeElement.scrollIntoView(false);
  }
  public get focusedItem() {
    return this._focusedItem;
  }

  constructor() { }

  ngOnInit() {
  }

  onSelected(item: ListItem<any>) {
    this.selected.emit(item);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e) {
    this.keyPressed.emit(e.which);
  }

}

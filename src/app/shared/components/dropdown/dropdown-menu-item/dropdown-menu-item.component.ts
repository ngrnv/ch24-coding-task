import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ListItem } from 'src/app/shared/components/dropdown/model';

@Component({
  selector: 'ch24-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuItemComponent implements OnInit {

  @Input() item: ListItem<any>;
  @Input() itemTemplate: TemplateRef<any>;

  @ViewChild('elem', { static: false, read: ElementRef }) elem: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}

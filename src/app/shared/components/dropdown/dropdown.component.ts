import { DOCUMENT } from '@angular/common';
import {
  Component, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild,
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { DropdownMenuComponent } from 'src/app/shared/components/dropdown/dropdown-menu/dropdown-menu.component';
import { shouldAutoClose } from 'src/app/shared/utils';
import { ListItem } from './model';

@Component({
  selector: 'ch24-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, OnDestroy {

  @Input() items: ListItem<any>[] = [];
  @Input() placeholder: string;
  @Input() itemTemplate: TemplateRef<any>;

  @Output() selected = new EventEmitter<ListItem<any>>();

  @ViewChild(DropdownMenuComponent, { read: ElementRef, static: false }) private ddMenu: ElementRef;

  protected _selectedItem: ListItem<any> = null;
  private closed$ = new Subject<void>();
  protected open$ = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone, @Inject(DOCUMENT) private document: any) {
    this.open$
      .pipe(
        filter(open => open),
        delay(100),
        tap(() => shouldAutoClose(this.zone, this.document, this.closed$, () => this.close(), [this.ddMenu])),
        untilDestroyed(this),
      )
      .subscribe();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.close();
  }

  public toggle() {
    if (this.open$.value) {
      this.close();
    } else {
      this.open();
    }
  }

  public open() {
    this.open$.next(true);
  }

  public close() {
    this.open$.next(false);
    this.closed$.next();
  }

  onSelected(item) {
    this._selectedItem = item;
    this.selected.emit(item);
    this.close();
  }

}

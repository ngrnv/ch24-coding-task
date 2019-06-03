import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild,
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { delay, filter, tap, withLatestFrom } from 'rxjs/operators';
import { DropdownMenuComponent } from 'src/app/shared/components/dropdown/dropdown-menu/dropdown-menu.component';
import { shouldAutoClose } from 'src/app/shared/utils';
import { Key, ListItem } from './model';

@Component({
  selector: 'ch24-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() items: ListItem<any>[] = [];
  @Input() placeholder: string;
  @Input() itemTemplate: TemplateRef<any>;

  @Output() selected = new EventEmitter<ListItem<any>>();

  @ViewChild(DropdownMenuComponent, { static: false }) private menu: DropdownMenuComponent;
  @ViewChild(DropdownMenuComponent, { read: ElementRef, static: false }) private menuElement: ElementRef;
  @ViewChild('toggleButton', { read: ElementRef, static: false }) private toggleButton: ElementRef;

  protected _selectedItem: ListItem<any> = null;
  private closed$ = new Subject<void>();
  protected open$ = new BehaviorSubject<boolean>(false);

  constructor(private zone: NgZone, @Inject(DOCUMENT) private document: any) {
    this.open$
      .pipe(
        filter(open => open),
        delay(100),   // wait for angular to render menu
        tap(() => {
          // restore scroll and focus position
          if (this._selectedItem) {
            this.menu.focusedItem = this.menu.menuItems.find(m => m.item.key === this._selectedItem.key);
          }
        }),
        tap(() => shouldAutoClose(this.zone, this.document, this.closed$, () => this.close(), [this.menuElement])),
        untilDestroyed(this),
      )
      .subscribe();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // handle toggle button keyboard events
    fromEvent<KeyboardEvent>(this.toggleButton.nativeElement, 'keydown')
      .pipe(
        filter(e => e.which === Key.ArrowDown),
        withLatestFrom(this.open$),
        tap(([e, isOpen]) => {
          if (!isOpen) {
            this.open();
          }
        }),
        delay(100),   // wait for angular to render menu
        tap(() => this.onKeyPressed(Key.ArrowDown)),
        untilDestroyed(this),
      ).subscribe();
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

  onKeyPressed(key) {
    if (!this.menu.focusedItem) {
      this.menu.focusedItem = this.menu.menuItems.first;
    } else {
      const itemsArray = this.menu.menuItems.toArray();
      const focusPosition = itemsArray.findIndex(item => this.menu.focusedItem.item.key === item.item.key);
      if (key === Key.ArrowDown && focusPosition < itemsArray.length - 1) {
        this.menu.focusedItem = itemsArray[focusPosition + 1];
      }
      if (key === Key.ArrowUp && focusPosition > 0) {
        this.menu.focusedItem = itemsArray[focusPosition - 1];
      }
    }
  }

}

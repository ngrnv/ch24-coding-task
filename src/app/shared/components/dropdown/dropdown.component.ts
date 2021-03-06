import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

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

  protected _disabled = false;
  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => any = () => {};

  constructor(private zone: NgZone, @Inject(DOCUMENT) private document: any) {
    this.open$
      .pipe(
        filter(open => open),
        delay(1),   // wait for angular to render menu
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
        delay(1),   // wait for angular to render menu
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
    this.onTouched();
  }

  public close() {
    this.open$.next(false);
    this.closed$.next();
  }

  onSelected(item) {
    this.writeValue(item);
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

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this._selectedItem = obj;
    this.onChange(obj);
  }

}

import { ElementRef, NgZone } from '@angular/core';
import { fromEvent, race, Subject } from 'rxjs';
import { delay, filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

const isContainedIn = (element: HTMLElement, array?: ElementRef[]) => {
  console.log('inside el', array);
  return array ? array.map(e => e.nativeElement)
    .some(item => item.contains(element)) : false;
};


export function shouldAutoClose(zone: NgZone,
                                document,
                                isDestroyed$: Subject<any>,
                                closeHandler: () => void,
                                insideElements: ElementRef[]) {
  zone.runOutsideAngular(() => {

    const shouldCloseOnClick = (event: MouseEvent | TouchEvent) => {
      const element = event.target as HTMLElement;
      return !isContainedIn(element, insideElements);
    };

    const escapes$ = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        tap(() => console.log('esc')),
        takeUntil(isDestroyed$),
        filter(e => e.which === 27),
      );

    const mouseDowns$ = fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(
        tap(() => console.log('md')),
        map(shouldCloseOnClick),
        tap(res => console.log('shouldCloseOnClick', res)),
        takeUntil(isDestroyed$),
      );

    const closeableClicks$ = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(
        tap(() => console.log('mu')),
        withLatestFrom(mouseDowns$),
        tap(args => console.log(args)),
        filter(([_, shouldClose]) => shouldClose),
        delay(50),
        takeUntil(isDestroyed$),
      );


    race([escapes$, closeableClicks$])
      .subscribe(() => zone.run(closeHandler));
  });
}

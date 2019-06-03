import { ElementRef, NgZone } from '@angular/core';
import { fromEvent, race, Subject } from 'rxjs';
import { delay, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

const isContainedIn = (element: HTMLElement, array?: ElementRef[]) => {
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
        takeUntil(isDestroyed$),
        filter(e => e.which === 27),
      );

    const mouseDowns$ = fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(
        map(shouldCloseOnClick),
        takeUntil(isDestroyed$),
      );

    const closeableClicks$ = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(
        withLatestFrom(mouseDowns$),
        filter(([e, shouldClose]) => shouldClose),
        delay(50),
        takeUntil(isDestroyed$),
      );

    race([escapes$, closeableClicks$])
      .subscribe(() => zone.run(closeHandler));
  });
}

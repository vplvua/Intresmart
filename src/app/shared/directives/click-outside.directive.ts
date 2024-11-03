import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();
  private wasInside = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('click', ['$event'])
  clickInside(event: MouseEvent) {
    event.stopPropagation();
    this.wasInside = true;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.wasInside) {
      const targetElement = event.target as HTMLElement;
      const clickedInside =
        this.elementRef.nativeElement.contains(targetElement);

      if (!clickedInside) {
        this.appClickOutside.emit();
      }
    }
    this.wasInside = false;
  }
}

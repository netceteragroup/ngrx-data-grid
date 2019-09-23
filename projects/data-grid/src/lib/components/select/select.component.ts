import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { identity } from 'ramda';

@Component({
  selector: 'ngrx-select',
  templateUrl: 'select.component.html',
  styleUrls: ['select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor {
  @Input() value: any;
  @Input() options: any[];

  @Output() selectionChanged = new EventEmitter<any>();

  private documentClickListener;
  propagateChange = identity;
  propagateTouched = identity;
  isOpened = false;

  constructor(private element: ElementRef, private renderer: Renderer2, private cd: ChangeDetectorRef) {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  toggleOpen(event) {
    event.preventDefault();
    if (this.isOpened) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.isOpened = true;
    this.bindDocumentClickListener();
  }

  hide() {
    this.isOpened = false;
    this.unbindDocumentClickListener();
  }

  onBlur(event): void {
    this.propagateTouched(event);
  }

  select(option: any) {
    this.value = option;
    this.propagateChange(this.value);
    this.selectionChanged.emit(this.value);
    this.hide();
  }

  private bindDocumentClickListener(): void {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen(
        'document',
        'click',
        event => this.onDocumentClick(event)
      );
    }
  }

  private onDocumentClick(event): void {
    if (this.isOutsideClick(event.target)) {
      this.hide();
      this.cd.markForCheck();
    }
  }

  private unbindDocumentClickListener(): void {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  private isOutsideClick(target): boolean {
    return !this.element.nativeElement.contains(target);
  }

}

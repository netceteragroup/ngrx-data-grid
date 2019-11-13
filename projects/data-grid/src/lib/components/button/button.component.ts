import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ButtonStyle } from './button-style';

enum ButtonType {
  Default = 'button',
  Submit = 'submit'
}

enum ButtonSize {
  Default = 'default',
  Small = 'small',
  Large = 'large'
}

@Component({
  selector: 'ngrx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @HostBinding('class.disabled')
  @Input() disabled = false;
  @Input() type = ButtonType.Default;
  @Input() buttonId = '';
  @Input() buttonSize = ButtonSize.Default;
  @Input() buttonStyle = ButtonStyle.Default;
  @Input() tabIndex;
  @Input() title = '';
  @Output() clicked = new EventEmitter();

  get buttonClasses() {
    return {
      'btn-sm': this.isSmall(),
      'btn-lg': this.isLarge(),
      'btn-outline': this.isDefault(),
      'btn-primary': this.isPrimary(),
      'btn-plain': this.isPlain()
    };
  }

  onClick($event) {
    if (!this.disabled) {
      this.clicked.emit($event);
    }
  }

  isSmall() {
    return this.buttonSize === ButtonSize.Small;
  }

  isLarge() {
    return this.buttonSize === ButtonSize.Large;
  }

  isDefault() {
    return this.buttonStyle === ButtonStyle.Default;
  }

  isPrimary() {
    return this.buttonStyle === ButtonStyle.Primary;
  }

  isPlain() {
    return this.buttonStyle === ButtonStyle.Plain;
  }

}

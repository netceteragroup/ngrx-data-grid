import { Component } from '@angular/core';

@Component({
  template: `<div>A filter</div>`,
})
export class CustomFilterComponent {
  filter() {
    console.log('Filter1, Filtering...');
    return true;
  }
}

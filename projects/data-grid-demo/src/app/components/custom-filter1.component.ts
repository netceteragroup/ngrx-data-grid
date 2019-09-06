import { Component } from '@angular/core';

@Component({
  template: `<div>Filter 2</div>`,
})
export class CustomFilter1Component {
  filter() {
    console.log('Filter2, Filtering...');
    return false;
  }
}

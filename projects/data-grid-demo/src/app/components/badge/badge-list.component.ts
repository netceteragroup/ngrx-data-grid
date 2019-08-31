import { Component, Input, OnInit } from '@angular/core';
import * as R from 'ramda';

export const zipAllWith = R.curry((fn, lists) => {
  const minLength = Math.min(...R.map(R.length, lists));
  const zipIndices = R.range(0, minLength);

  return R.map((i: number) =>
      fn(...R.map(R.nth(i), lists)),
    zipIndices
  );
});

const zipAll = zipAllWith((...args) => args);

@Component({
  selector: 'app-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.scss']
})
export class BadgeListComponent implements OnInit {
  @Input() badges: any;
  @Input() extended = false;
  badgesTuples: any;

  ngOnInit(): void {
    const {requester, manager, coordinator} = this.badges;
    this.badgesTuples = zipAll([requester, manager, coordinator]);
  }

}

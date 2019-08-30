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
  selector: 'app-traffic-lights-list',
  templateUrl: './traffic-lights-list-column.component.html',
  styleUrls: ['./traffic-lights-list-column.component.scss']
})
export class TrafficLightsListColumnComponent implements OnInit {
  @Input() trafficLights: any;
  @Input() extended = false;
  trafficLightTuples: any;

  ngOnInit(): void {
    const {ru, im, coss} = this.trafficLights;
    this.trafficLightTuples = zipAll([ru, im, coss]);
  }

}

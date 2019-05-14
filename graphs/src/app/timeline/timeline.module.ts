import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { TimelineRoutingModule } from './timeline-routing.module';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    TimelineRoutingModule
  ]
})
export class TimelineModule { }

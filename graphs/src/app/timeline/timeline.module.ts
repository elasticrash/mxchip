import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart/chart.component';
import { TimelineRoutingModule } from './timeline-routing.module';
import { DataService } from './services/data.service';
import { SharedModule } from '../shared/shared.module';
import { NgxChartsModule, LineChartModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    TimelineRoutingModule,
    SharedModule,
    NgxChartsModule,
    LineChartModule
  ],
  providers: [DataService]
})
export class TimelineModule { }

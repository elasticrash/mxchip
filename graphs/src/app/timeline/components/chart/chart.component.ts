import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public data: any;

  public view: any[];
  private width = 1200;
  private height = 600;

  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public legendTitle = 'Legend';
  public legendPosition = 'right';
  public showXAxisLabel = true;
  public tooltipDisabled = false;
  public showYAxisLabel = true;
  public showGridLines = true;
  public innerPadding = '10%';
  public barPadding = 8;
  public groupPadding = 16;
  public roundDomains = false;
  public maxRadius = 10;
  public minRadius = 3;
  public showSeriesOnHover = true;
  public roundEdges = true;
  public animations = true;
  public xScaleMin: any;
  public xScaleMax: any;
  public yScaleMin: number;
  public yScaleMax: number;
  public showDataLabel = false;
  public trimXAxisTicks = true;
  public trimYAxisTicks = true;
  public rotateXAxisTicks = true;
  public maxXAxisTickLength = 32;
  public maxYAxisTickLength = 32;
  public colorSets: any;
  public schemeType = 'ordinal';
  public selectedColorScheme: string;
  public rangeFillOpacity = 0.15;

  public colorScheme = {
    domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5']
  };

  public chartData = [
    {
      name: 'Temperature',
      series: [
      ]
    },

    {
      name: 'Humidity',
      series: [
      ]
    }
  ];

  constructor(private dataService: DataService) { }

  async ngOnInit() {
    this.applyDimensions();
    try {
      this.data = this.dataService.get('', null).subscribe((x) => {
        x.forEach((element: { humidity: number, temperature: number, timestamp: number }) => {
          this.chartData[0].series.push({ name: new Date(element.timestamp * 1000).toLocaleTimeString(), value: element.temperature });
          this.chartData[1].series.push({ name: new Date(element.timestamp * 1000).toLocaleTimeString(), value: element.humidity });
        });
        this.chartData = [...this.chartData];

      });

    } catch (error) {
      console.log(error);
    }
  }

  applyDimensions() {
    this.view = [this.width, this.height];
  }

}

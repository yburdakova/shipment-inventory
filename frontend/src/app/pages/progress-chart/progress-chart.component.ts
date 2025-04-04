import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent {
  @Input() untouched: number = 0;
  @Input() ip: number = 0;
  @Input() scanned: number = 0;
  @Input() reviewed: number = 0;
  @Input() returned: number = 0;
  @Input() total_rows: number = 1;
  @Input() uploaded: number = 0;


  getSegments() {
    return [
      { label: this.untouched, class: 'untouched', value: this.untouched },
      { label: this.ip, class: 'ip', value: this.ip },
      { label: this.scanned, class: 'scanned', value: this.scanned },
      { label: this.reviewed, class: 'reviewed', value: this.reviewed },
      { label: this.returned, class: 'returned', value: this.returned }
    ].filter(segment => segment.value > 0);
  }

  getPercentage(value: number): number {
    return this.total_rows > 0 ? (value / this.total_rows) * 100 : 0;
  }
}

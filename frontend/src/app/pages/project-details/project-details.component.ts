import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectStats } from '../../models/stats.model';
import { ProgressChartComponent } from '../progress-chart/progress-chart.component';
import { extractCategoryAndNumber } from '../../shared/utils/box-utils';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  imports: [CommonModule, ProgressChartComponent],
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: { ID: number; Description: string } | null = null;
  stats: ProjectStats | null = null;
  deliveries: ProjectStats["deliveries"] = [];
  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.loadProject();
    });
  }

  private loadProject(): void {
    this.project = this.projectService.getProject();

    if (!this.project || this.project.ID === undefined) {
      console.error('Project is not selected.');
      return;
    }

    this.fetchProjectStats(this.project.ID);
  }

  private fetchProjectStats(projectId: number): void {
    this.projectService.getProjectStats(projectId).subscribe({
      next: (data) => {
        console.log('Received stats:', data);
        this.stats = { ...data };
        this.deliveries = JSON.parse(JSON.stringify(data.deliveries)).sort(
          (a:any, b:any) => new Date(b.RegisterDate).getTime() - new Date(a.RegisterDate).getTime()
        );;

      console.log('Updated deliveries:', this.deliveries);

      setTimeout(() => this.deliveries = [...this.deliveries], 0);
      },
      error: (error) => {
        console.error('Error loading project stats:', error);
      },
      complete: () => {
        console.log('Project stats loading completed.');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  
  generateBoxRange(boxList: { BoxGUID: string; CaseType: string }[]): string {
    if (!boxList || boxList.length === 0) {
        return "";
    }

    const groupedBoxes: { [key: string]: number[] } = {};

    for (const box of boxList) {
        const match = box.BoxGUID.match(/([A-Z]+)-(\d+)\./);
        if (!match) continue;

        const caseType = box.CaseType;
        const boxNumber = parseInt(match[2], 10);

        if (!groupedBoxes[caseType]) {
            groupedBoxes[caseType] = [];
        }
        groupedBoxes[caseType].push(boxNumber);
    }

    const rangeStrings: string[] = [];

    for (const caseType in groupedBoxes) {
        if (groupedBoxes.hasOwnProperty(caseType)) {
            const sortedNumbers = [...new Set(groupedBoxes[caseType])].sort((a, b) => a - b);
            const firstNumber = sortedNumbers[0];
            const lastNumber = sortedNumbers[sortedNumbers.length - 1];

            rangeStrings.push(`${caseType}:${firstNumber}-${lastNumber}`);
        }
    }

    return rangeStrings.join(", ");
}




}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoxService } from '../../services/box.service';
import { CommonModule } from '@angular/common';
import { BoxDetails } from '../../models/box.model';

@Component({
  selector: 'app-box-details',
  templateUrl: './box-details.component.html',
  imports: [CommonModule],
  styleUrl: './box-details.component.scss'
})
export class BoxDetailsComponent implements OnInit {
  boxId!: number;
  boxBarcode: string = 'Loading...'; 
  boxData: BoxDetails | null = null; 
  sortAscending: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private boxService: BoxService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.boxId = Number(params.get('id'));
      this.loadBoxDetails();
    });
  }
  

  loadBoxDetails(): void {
    this.boxData = null;
    this.boxBarcode = 'Loading...';
  
    this.boxService.getBoxDetailsById(this.boxId).subscribe({
      next: (response: BoxDetails) => {
        console.log('Full Box Data:', response);
        this.boxBarcode = response.Barcode;
        this.boxData = response;
      },
      error: (error) => {
        console.error('Error loading box details:', error);
      }
    });
  }
  

  get sortedHistory() {
    if (!this.boxData?.History) return [];
    return [...this.boxData.History].sort((a, b) =>
      this.sortAscending
        ? new Date(a.ActivityStarted).getTime() - new Date(b.ActivityStarted).getTime()
        : new Date(b.ActivityStarted).getTime() - new Date(a.ActivityStarted).getTime()
    );
  }

  toggleSortOrder(): void {
    this.sortAscending = !this.sortAscending;
  }

  get totalTime(): number {
    const b = this.boxData;
    return b ? (b.Inspection_Time ?? 0) + (b.Prep_Time ?? 0) + (b.Scan1_Time ?? 0) + (b.Scan2_Time ?? 0) + (b.Review_Time ?? 0) : 0;
  }
}

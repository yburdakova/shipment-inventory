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
    this.boxId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBoxDetails();
  }

  loadBoxDetails(): void {
    this.boxService.getBoxDetailsById(this.boxId).subscribe({
      next: (response: BoxDetails) => {
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
}

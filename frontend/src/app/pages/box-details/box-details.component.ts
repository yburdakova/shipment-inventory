import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoxService } from '../../services/box.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-box-details',
  templateUrl: './box-details.component.html',
  imports: [CommonModule],
  styleUrl: './box-details.component.scss'
})
export class BoxDetailsComponent implements OnInit {
  boxId!: number;
  boxGUID!: string;

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
      next: (response) => {
        this.boxGUID = response.BoxGUID;
      },
      error: (error) => {
        console.error('Failed to load box details:', error);
      }
    });
  }
}

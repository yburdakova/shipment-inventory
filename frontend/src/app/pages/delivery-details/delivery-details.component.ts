import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BoxDetails } from '../../models/stats.model';


@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements OnInit {
  projectId!: string;
  deliveryDate!: string;
  boxes: BoxDetails[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.deliveryDate = this.route.snapshot.paramMap.get('deliveryDate') || '';

    console.log('Project ID:', this.projectId);
    console.log('Delivery Date:', this.deliveryDate);


    if (history.state && history.state.boxes) {
      this.boxes = history.state.boxes;
      console.log('Received boxes:', this.boxes);
    } else {
      console.warn('No boxes data found in history.state');
    }
  }
}
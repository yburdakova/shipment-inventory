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

  copyTableToClipboard(): void {
    if (!this.boxes || this.boxes.length === 0) {
      console.warn("No data to copy.");
      return;
    }
  
    const header = ["#", "Box GUID", "Status"].join("\t");
    const rows = this.boxes.map((box, index) => [
      index + 1,
      box.BoxGUID,
      box.StatusLabel
    ].join("\t"));
  
    const tableData = [header, ...rows].join("\n");
  
    navigator.clipboard.writeText(tableData).then(() => {
      console.log("Table copied to clipboard");
      alert("Table copied! You can now paste it into Google Sheets.");
    }).catch(err => {
      console.error("Error copying table:", err);
    });
  }
}
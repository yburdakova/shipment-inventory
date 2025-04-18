import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatusFilters } from '../../models/delivery.model';
import { BoxDetails } from '../../models/stats.model';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements OnInit {
  projectId!: string;
  deliveryDate!: string;
  boxes: BoxDetails[] = [];
  filteredBoxes: BoxDetails[] = [];
  sortDirection: 'asc' | 'desc' | '' = '';


  statusFilters: StatusFilters = {
    "No Filters": { active: true, statuses: [] },
    "Delivered": { active: false, statuses: [1, 2] },
    "Scanned": { active: false, statuses: [9, 10, 11, 12, 13, 16] },
    "Reviewed": { active: false, statuses: [11] },
    "In progress": { active: false, statuses: [3, 4, 5, 6, 7, 8, 10] },
    "Uploaded": { active: false, statuses: [13] },
    "Destroyed": { active: false, statuses: [14] },
    "Returned": { active: false, statuses: [15, 16] }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.deliveryDate = this.route.snapshot.paramMap.get('deliveryDate') || '';

    console.log('Project ID:', this.projectId);
    console.log('Delivery Date:', this.deliveryDate);

    if (history.state && history.state.boxes) {
      this.boxes = history.state.boxes;
      this.filteredBoxes = [...this.boxes];
      console.log('Received boxes:', this.boxes);
    } else {
      console.warn('No boxes data found in history.state');
    }
  }

  getStatusFilterKeys(): string[] {
    return Object.keys(this.statusFilters);
  }

 sortByBoxGUID(): void {
    if (this.sortDirection === '') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = '';
    }
  
    if (this.sortDirection === '') {
      this.applyFilters();
      return;
    }
  }

  toggleFilter(filterName: string): void {
    if (filterName === "No Filters") {
      Object.keys(this.statusFilters).forEach(name => {
        this.statusFilters[name].active = false;
      });
      this.statusFilters["No Filters"].active = true;
    } else {
      this.statusFilters["No Filters"].active = false;
      this.statusFilters[filterName].active = !this.statusFilters[filterName].active;
    }

    const anyFilterActive = Object.values(this.statusFilters).some(filter => filter.active);
    if (!anyFilterActive) {
      this.statusFilters["No Filters"].active = true;
    }

    this.applyFilters();
  }

  applyFilters(): void {
    if (this.statusFilters["No Filters"].active) {
      this.filteredBoxes = [...this.boxes];
      return;
    }

    const activeStatuses = Object.values(this.statusFilters)
      .filter(filter => filter.active)
      .flatMap(filter => filter.statuses);

    this.filteredBoxes = this.boxes.filter(box => activeStatuses.includes(box.StatusID));
  }

  copyTableToClipboard(): void {
    if (!this.filteredBoxes || this.filteredBoxes.length === 0) {
      console.warn("No data to copy.");
      return;
    }

    const header = ["#", "Box GUID", "Status"].join("\t");
    const rows = this.filteredBoxes.map((box, index) => [
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

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BoxedService } from '../../services/boxed.service';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent implements AfterViewInit {
  @ViewChild('scanBoxInput') scanBoxInput!: ElementRef;
  boxedList: any[] = [];
  deliveredList: any[] = [];
  statusMessage: string = "";
  statusType: 'success' | 'error' | '' = '';
  isProcessing: boolean = false;

  contextMenuVisible: boolean = false;
  contextMenuX: number = 0;
  contextMenuY: number = 0;
  selectedBox: any = null;
  longPressTimeout: any = null;
  
  private readonly STORAGE_KEY = "deliveredBoxes";

  constructor(private boxedService: BoxedService) {}

  @HostListener('document:click', ['$event'])
  closeContextMenu(event: MouseEvent) {
    if (!event.target || !(event.target as HTMLElement).closest('.context-menu')) {
      this.contextMenuVisible = false;
    }
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnInit(): void {
    this.refreshBoxedList();
    this.loadDeliveredList();
  }

  setFocus() {
    if (this.scanBoxInput) {
      this.scanBoxInput.nativeElement.focus();
    }
  }

  /** Load deliveredList from localStorage on page reload */
  private loadDeliveredList() {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      this.deliveredList = JSON.parse(savedData);
      console.log("Restored deliveredList from localStorage:", this.deliveredList);
    }
  }

  /** Save deliveredList to localStorage */
  private saveDeliveredList() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.deliveredList));
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const barcode = this.scanBoxInput.nativeElement.value.trim();
      this.processScan(barcode);
    }
  }

  processScan(barcode: string): void {
    const alreadyDelivered = this.deliveredList.some(item => item.BoxGUID === barcode);
    const existsInBoxedList = this.boxedList.some(item => item.BoxGUID === barcode);

    if (alreadyDelivered) {
      this.displayMessage("Already Added!", "error");
      return;
    }

    if (!existsInBoxedList) {
      this.displayMessage("Unknown Barcode!", "error");
      return;
    }

    const box = this.boxedList.find(item => item.BoxGUID === barcode);
    if (box) {
      this.deliveredList.push(box);
      this.saveDeliveredList(); // Save to localStorage
      this.displayMessage("Ready to Delivery!", "success");
      console.log("Updated deliveredList:", this.deliveredList);
    }
  }

  displayMessage(message: string, type: 'success' | 'error'): void {
    this.statusMessage = "";
    this.statusType = "";

    setTimeout(() => {
        this.statusMessage = message;
        this.statusType = type;
    }, 100);

    this.scanBoxInput.nativeElement.value = '';
    this.setFocus();

  }

  isDelivered(barcode: string): boolean {
    return this.deliveredList.some(item => item.BoxGUID === barcode);
  }

  makeDelivery(): void {
    if (this.deliveredList.length === 0) {
      this.displayMessage("No items to deliver!", "error");
      return;
    }

    this.isProcessing = true;
    const payload = this.deliveredList.map(box => ({ ID: box.ID }));

    this.boxedService.updateDeliveredStatus(payload).subscribe({
      next: (response) => {
        console.log('Delivery response:', response);
        this.displayMessage("Delivery completed!", "success");
        this.deliveredList = [];
        this.saveDeliveredList();
        this.refreshBoxedList(); 
      },
      error: (error) => {
        console.error('Delivery error:', error);
        this.displayMessage("Delivery failed!", "error");
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  refreshBoxedList(): void {
    this.boxedService.getBoxedList().subscribe({
      next: (data) => {
        this.boxedList = data;
      },
      error: (error) => {
        console.error("Error refreshing boxed list:", error);
      }
    });
  }

  openContextMenu(event: MouseEvent, box: any) {
    event.preventDefault();
    this.selectedBox = box;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuVisible = true;
  }

  startLongPress(event: TouchEvent, box: any) {
    this.longPressTimeout = setTimeout(() => {
      this.selectedBox = box;
      this.contextMenuX = event.touches[0].clientX;
      this.contextMenuY = event.touches[0].clientY;
      this.contextMenuVisible = true;
    }, 500);
  }

  cancelLongPress() {
    clearTimeout(this.longPressTimeout);
  }

  removeFromDelivered(box: any) {
    this.deliveredList = this.deliveredList.filter(item => item.BoxGUID !== box.BoxGUID);
    this.saveDeliveredList();
    this.contextMenuVisible = false;
    this.displayMessage("Box removed!", "success");
    console.log("Updated deliveredList:", this.deliveredList);
    this.setFocus();
  }

  clearDeliveredList(): void {
    this.deliveredList = [];
    localStorage.removeItem(this.STORAGE_KEY);
    this.displayMessage("Delivered list cleared!", "success");
}
}

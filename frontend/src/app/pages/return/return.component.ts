import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ReturnedService } from '../../services/returned.service';
import { extractCategoryAndNumber } from '../../shared/utils/box-utils';

@Component({
  selector: 'app-return',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements AfterViewInit {
  @ViewChild('scanBoxInput') scanBoxInput!: ElementRef;
  readyList: any[] = [];
  returnedList: any[] = [];
  statusMessage: string = "";
  statusType: 'success' | 'error' | '' = '';
  isProcessing: boolean = false;

  contextMenuVisible: boolean = false;
  contextMenuX: number = 0;
  contextMenuY: number = 0;
  selectedBox: any = null;
  longPressTimeout: any = null;
  
  private readonly STORAGE_KEY = "returnedBoxes";

  constructor(private returnedService: ReturnedService) {}

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
    this.refreshReadyList();
    this.loadReturnedList();
  }

  setFocus() {
    if (this.scanBoxInput) {
      this.scanBoxInput.nativeElement.focus();
    }
  }

  saveToFile(): void {
    if (this.returnedList.length === 0) {
      this.displayMessage('No items to save!', 'error');
      return;
    }
  
    const sortedList = this.returnedList
      .map(box => box.BoxGUID)
      .sort((a, b) => {
        const [categoryA, numberA] = extractCategoryAndNumber(a);
        const [categoryB, numberB] = extractCategoryAndNumber(b);
  
        if (categoryA < categoryB) return -1;
        if (categoryA > categoryB) return 1;
        return numberA - numberB;
      });
  
    const data = sortedList.join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
  
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const fileName = `returnedList-${formattedDate}.txt`;
  
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  
    this.displayMessage('File saved successfully!', 'success');
  }
  
  private loadReturnedList() {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      this.returnedList = JSON.parse(savedData);
      console.log("Restored returnedList from localStorage:", this.returnedList);
    }
  }

  private saveReturnedList() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.returnedList));
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      let barcode = this.scanBoxInput.nativeElement.value.trim();
      barcode = barcode.replace(/^([a-zA-Z]{3})/, (_: string, letters: string) => letters.toUpperCase());
      this.processScan(barcode);
    }
  }

  processScan(barcode: string): void {
    const alreadyReturned = this.returnedList.some(item => item.BoxGUID === barcode);
    const existsInReadyList = this.readyList.some(item => item.BoxGUID === barcode);

    if (alreadyReturned) {
      this.displayMessage("Already added to return list!", "error");
      return;
    }

    if (!existsInReadyList) {
      this.displayMessage("Unknown Barcode!", "error");
      return;
    }

    const box = this.readyList.find(item => item.BoxGUID === barcode);
    if (box) {
      this.returnedList.push(box);
      this.saveReturnedList();
      this.displayMessage("Added to return list!", "success");
      console.log("Updated returnedList:", this.returnedList);
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

  isReturned(barcode: string): boolean {
    return this.returnedList.some(item => item.BoxGUID === barcode);
}

  makeReturn(): void {
    if (this.returnedList.length === 0) {
      this.displayMessage("No items to return!", "error");
      return;
    }

    this.isProcessing = true;
    const payload = this.returnedList.map(box => ({ ID: box.ID }));

    this.returnedService.updateReturnedStatus(payload).subscribe({
      next: (response) => {
        console.log('Return response:', response);
        this.displayMessage("Return completed!", "success");
        this.returnedList = [];
        this.saveReturnedList();
        this.refreshReadyList(); 
      },
      error: (error) => {
        console.error('Return error:', error);
        this.displayMessage("Return failed!", "error");
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  refreshReadyList(): void {
    this.returnedService.getReturnedList().subscribe({
      next: (data) => {
        this.readyList = data;
        console.log('Ready list loaded:', this.readyList);
      },
      error: (error) => {
        console.error("Error refreshing ready list:", error);
      }
    });
  }
  
  selectBox(box: any): void {
    const alreadySelected = this.returnedList.some(item => item.BoxGUID === box.BoxGUID);

    if (!alreadySelected) {
        this.returnedList.push(box);
        this.saveReturnedList();
        this.displayMessage("Box selected!", "success");
        console.log("Updated returnedList:", this.returnedList);
    } else {
        this.displayMessage("Box already selected!", "error");
    }

    this.contextMenuVisible = false;
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

  removeFromReturned(box: any) {
    this.returnedList = this.returnedList.filter(item => item.BoxGUID !== box.BoxGUID);
    this.saveReturnedList();
    this.contextMenuVisible = false;
    this.displayMessage("Box removed from return list!", "success");
    console.log("Updated returnedList:", this.returnedList);
    this.setFocus();
  }

  clearReturnedList(): void {
    this.returnedList = [];
    localStorage.removeItem(this.STORAGE_KEY);
    this.displayMessage("Return list cleared!", "success");
  }
}

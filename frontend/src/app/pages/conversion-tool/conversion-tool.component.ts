import { Component } from '@angular/core';
import { CaseService } from '../../services/case.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversion-tool',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversion-tool.component.html',
  styleUrls: ['./conversion-tool.component.scss'],
  providers: [],
})
export class ConversionToolComponent {
  convertedCaseNumbers: string[] = [];
  missingCases: string[] = [];
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';

  constructor(private caseService: CaseService) {}

  onFolderSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    const files = Array.from(input.files);
    this.convertedCaseNumbers = files
      .filter(file => file.name.toLowerCase().endsWith('.pdf'))
      .filter(file => !file.name.toUpperCase().includes('-C'))
      .map(file => file.name.replace(/\.pdf$/i, ''));

    console.log('✅ Filtered file names:', this.convertedCaseNumbers);
  }

  markAsConverted(): void {
    if (this.convertedCaseNumbers.length === 0) {
      this.statusType = 'error';
      this.statusMessage = 'No case numbers to convert.';
      this.clearStatusAfterDelay();
      return;
    }
  
    this.caseService.markCasesAsConverted(this.convertedCaseNumbers).subscribe({
      next: (res) => {
        console.log('Upload status updated:', res);
        this.missingCases = res.missingCases || [];
  
        if (this.missingCases.length === 0) {
          this.statusType = 'success';
          this.statusMessage = 'Upload status successfully updated!';
        } else {
          this.statusType = 'success';
          this.statusMessage = 'Some cases updated. Missing cases listed below.';
        }
  
        this.clearStatusAfterDelay();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.statusType = 'error';
        this.statusMessage = 'Failed to update upload status.';
        this.clearStatusAfterDelay();
      }
    });
  }
  
  private clearStatusAfterDelay(): void {
    setTimeout(() => {
      this.statusMessage = '';
      this.statusType = '';
    }, 5000);
  }
  
}

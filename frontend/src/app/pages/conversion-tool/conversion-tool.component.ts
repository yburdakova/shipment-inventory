import { Component } from '@angular/core';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-conversion-tool',
  standalone: true,
  templateUrl: './conversion-tool.component.html',
  styleUrls: ['./conversion-tool.component.scss'],
  providers: [],
})
export class ConversionToolComponent {
  convertedCaseNumbers: string[] = [];

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
      alert('No case numbers to convert.');
      return;
    }

    this.caseService.markCasesAsConverted(this.convertedCaseNumbers).subscribe({
      next: (res) => {
        console.log('🟢 Upload status updated:', res);
        alert('Upload status successfully updated!');
      },
      error: (err) => {
        console.error('🔴 Error updating status:', err);
        alert('Failed to update upload status.');
      }
    });
  }
}

import { Component } from '@angular/core';
import { CaseService } from '../../services/case.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-conversion-tool',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversion-tool.component.html',
  styleUrls: ['./conversion-tool.component.scss'],
})
export class ConversionToolComponent {
  convertedCaseNumbers: string[] = [];
  converted: string[] = [];
  alreadyConverted: string[] = [];
  notFound: string[] = [];
  similarFound: { original: string, match: string }[] = [];
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';

  constructor(
    private caseService: CaseService,
    private userService: UserService
  ) {}

  onFolderSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    this.convertedCaseNumbers = files
      .filter(file => file.name.toLowerCase().endsWith('.pdf'))
      .map(file => file.name.replace(/\.pdf$/i, ''));
  }

  markAsConverted(): void {
    if (this.convertedCaseNumbers.length === 0) {
      this.statusType = 'error';
      this.statusMessage = 'No case numbers to convert.';
      this.clearStatusAfterDelay();
      return;
    }

    const user = this.userService.getUser();
    if (!user) {
      this.statusType = 'error';
      this.statusMessage = 'User not found in storage.';
      this.clearStatusAfterDelay();
      return;
    }

    const userId = user.id;

    this.caseService.markCasesAsConverted(this.convertedCaseNumbers, userId).subscribe({
      next: (res) => {
        this.converted = res.toUpdate || [];
        this.alreadyConverted = res.alreadyConverted || [];
        this.notFound = res.notFound || [];
        this.similarFound = res.similarFound || [];

        const nothingUpdated = !this.converted.length && !this.alreadyConverted.length && !this.similarFound.length;

        this.statusType = nothingUpdated ? 'error' : '';
        this.statusMessage = nothingUpdated ? 'No cases were updated.' : '';
        this.clearStatusAfterDelay();
      },
      error: () => {
        this.statusType = 'error';
        this.statusMessage = 'Failed to update upload status.';
        this.clearStatusAfterDelay();
      }
    });
  }

  updateSimilarCase(caseNumber: string): void {
    const user = this.userService.getUser();
    if (!user) return;

    const userId = user.id;

    this.caseService.markCasesAsConverted([caseNumber], userId).subscribe({
      next: () => {
        this.similarFound = this.similarFound.filter(pair => pair.match !== caseNumber);
        if (!this.converted.includes(caseNumber)) this.converted.push(caseNumber);
      }
    });
  }

  downloadList(data: string[], filename: string): void {
    const blob = new Blob([data.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private clearStatusAfterDelay(): void {
    setTimeout(() => {
      this.statusMessage = '';
      this.statusType = '';
    }, 4000);
  }
}

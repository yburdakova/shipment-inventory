import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CaseSearchService } from '../../services/case-search.service';

@Component({
  selector: 'app-pull-request-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pull-request-tool.component.html',
  styleUrls: ['./pull-request-tool.component.scss']
})
export class PullRequestToolComponent implements AfterViewInit{
  searchTerm: string = '';
  suggestions: string[] = [];
  caseResults: any[] = [];
  notFound = false;
  boxInfo: any = null;
  caseTypes: any[] = [];
  selectedType: string | null = null;
  displayCase: string | null = null;

  constructor(private caseService: CaseSearchService) {
  }

  @ViewChild('caseInput') caseInputRef!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.caseInputRef.nativeElement.focus();
    }, 0);
  }

  ngOnInit() {
    this.caseService.getCaseTypes().subscribe(types => {
      this.caseTypes = types;
  
      const defaultType = types.find(t => t.Abbreviation === 'CRI');
      this.selectedType = defaultType ? defaultType.Abbreviation : null;
    });
  }

  selectType(abbr: string) {
    if (this.selectedType === abbr) {
      this.selectedType = null;
    } else {
      this.selectedType = abbr;
    }
  
    this.caseResults = [];
    this.boxInfo = null;
    this.notFound = false;
    this.displayCase = null;
  
    this.onInputChange();
  }
  
  canSearch(): boolean {
    return (
      this.selectedType !== null &&
      this.searchTerm.trim().length >= 3 &&
      this.suggestions.length === 0
    );
  }

  onInputChange() {
    const query = this.searchTerm.trim();
  
    if (this.displayCase && !this.searchTerm.includes(this.displayCase.split(' ')[1])) {
      this.caseResults = [];
      this.boxInfo = null;
      this.notFound = false;
      this.displayCase = null;
    }
  
    if (!this.selectedType || query.length < 3) {
      this.suggestions = [];
      return;
    }
  
    this.caseService.getAutocompleteSuggestions(query, this.selectedType).subscribe(data => {
      this.suggestions = data;
    }, error => {
      console.error('[Autocomplete Error]', error);
    });
  }
  
  
  selectSuggestion(suggestion: string) {
    const [caseType, caseNumber] = suggestion.split(' ');
  
    this.searchTerm = caseNumber;
    this.suggestions = [];
    this.displayCase = `${caseType} ${caseNumber}`;
    this.caseResults = [];
    this.notFound = false;
    this.boxInfo = null;
  
    this.loadCaseDetails(caseNumber, caseType);
  }
  
  searchInBoxes() {
    const caseNumber = this.searchTerm.trim().replace(/^0+/, '');
    const caseType = this.selectedType;
  
    if (!caseNumber || !caseType) return;
  
    this.boxInfo = null;
  
    this.caseService.findCaseInBox(caseNumber, caseType).subscribe(data => {
      this.boxInfo = data;
    }, error => {
      if (error.status === 404) {
        this.boxInfo = { notFound: true };
      } else {
        this.boxInfo = null;
      }
    });
  }

  loadCaseDetails(caseNumber: string, caseTypeAbbr: string) {
    this.caseResults = [];
    this.notFound = false;
    this.boxInfo = null;
  
    this.caseService.getCaseDetails(caseNumber, caseTypeAbbr).subscribe(results => {
      if (results.length > 0) {
        this.caseResults = results;
      } else {
        this.notFound = true;
      }
    });
  }
  
  manualSearch() {
    if (!this.searchTerm || !this.selectedType) {
      return;
    }
  
    const caseNumber = this.searchTerm.trim().replace(/^0+/, '');
    const caseTypeAbbr = this.selectedType;
  
    this.caseResults = [];
    this.notFound = false;
    this.boxInfo = null;
    this.displayCase = `${caseTypeAbbr} ${caseNumber}`;
  
    this.caseService.getCaseDetails(caseNumber, caseTypeAbbr).subscribe(results => {
      if (results.length > 0) {
        this.caseResults = results;
      } else {
        this.notFound = true;
    
        this.caseService.findCaseInBox(caseNumber, caseTypeAbbr).subscribe(data => {
          this.boxInfo = data;
        }, error => {
          if (error.status === 404) {
            this.boxInfo = { notFound: true };
          } else {
            this.boxInfo = null;
          }
        });
      }
    });    
  }
  
  
  
}

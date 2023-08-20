import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  constructor(private http: HttpClient) { }

  @Input() repositories: any[] = [];
  @Input() currentPage: number = 1;
  private _totalPages: number = 1;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() repositorySelected = new EventEmitter<any>();

  selectedRepoIssues: any;
  viewingIssues: boolean = false;
  selectedRepo: any;

  @Input() set totalPages(value: number) {
    this._totalPages = Math.min(value, 100);
  }

  get totalPages(): number {
    return this._totalPages;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
      window.scrollTo(0, 0);
    }
  }

  selectRepository(repository: any) {
    this.repositorySelected.emit(repository);
  }

  showIssues(repo: any) {
    const apiUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues`;

    this.http.get(apiUrl).subscribe((response: any) => {
      this.selectedRepoIssues = response;
      this.viewingIssues = true;
      this.selectedRepo = repo;
      window.scrollTo(0, 0);
    });
  }

  backToRepositories() {
    this.viewingIssues = false;
    this.selectedRepo = null;
    window.scrollTo(0, 0);
  }
}

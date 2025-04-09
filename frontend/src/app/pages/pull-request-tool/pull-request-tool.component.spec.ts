import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestToolComponent } from './pull-request-tool.component';

describe('PullRequestToolComponent', () => {
  let component: PullRequestToolComponent;
  let fixture: ComponentFixture<PullRequestToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullRequestToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullRequestToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

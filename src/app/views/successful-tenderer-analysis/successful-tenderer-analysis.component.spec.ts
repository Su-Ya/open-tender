import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulTendererAnalysisComponent } from './successful-tenderer-analysis.component';

describe('SuccessfulTendererAnalysisComponent', () => {
  let component: SuccessfulTendererAnalysisComponent;
  let fixture: ComponentFixture<SuccessfulTendererAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessfulTendererAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfulTendererAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

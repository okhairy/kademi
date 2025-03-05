import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanCarteModalComponent } from './scan-carte-modal.component';

describe('ScanCarteModalComponent', () => {
  let component: ScanCarteModalComponent;
  let fixture: ComponentFixture<ScanCarteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanCarteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanCarteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VigileRestoComponent } from './vigile-resto.component';

describe('VigileRestoComponent', () => {
  let component: VigileRestoComponent;
  let fixture: ComponentFixture<VigileRestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VigileRestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VigileRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

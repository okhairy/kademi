import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMyPwdComponent } from './change-my-pwd.component';

describe('ChangeMyPwdComponent', () => {
  let component: ChangeMyPwdComponent;
  let fixture: ComponentFixture<ChangeMyPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeMyPwdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeMyPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

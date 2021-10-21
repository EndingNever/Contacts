import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthContactsComponent } from './auth-contacts.component';

describe('AuthContactsComponent', () => {
  let component: AuthContactsComponent;
  let fixture: ComponentFixture<AuthContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsTableComponent } from './admins-table.component';

describe('AdminsTableComponent', () => {
  let component: AdminsTableComponent;
  let fixture: ComponentFixture<AdminsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

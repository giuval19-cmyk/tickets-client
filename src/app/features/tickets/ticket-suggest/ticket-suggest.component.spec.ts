import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSuggestComponent } from './ticket-suggest.component';

describe('TicketSuggestComponent', () => {
  let component: TicketSuggestComponent;
  let fixture: ComponentFixture<TicketSuggestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSuggestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

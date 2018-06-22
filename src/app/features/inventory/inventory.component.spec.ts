import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { InventoryService } from './inventory.service';
import { InventoryComponent } from './inventory.component';
import { ItemDetailComponent } from './item.component';

xdescribe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let serv,mockRouter;
  beforeEach(async(() => {
    serv = jasmine.createSpyObj('invServiceStub', ['getItems']);
    mockRouter = {navigate: jasmine.createSpy('navigate')};
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ InventoryComponent,
        ItemDetailComponent,
      ],
      providers: [  { provide: InventoryService, useValue: serv },
      { provide: Router, useValue: mockRouter }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

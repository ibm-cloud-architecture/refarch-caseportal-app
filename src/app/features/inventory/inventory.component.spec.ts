import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { InventoryComponent } from './inventory.component';
import { ItemDetailComponent } from './item.component';

xdescribe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let serv;
  beforeEach(async(() => {
    serv = jasmine.createSpyObj('invServiceStub', ['getItems']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ InventoryComponent,
        ItemDetailComponent,
      ],
      providers: [  { provide: InventoryService, useValue: serv }]
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

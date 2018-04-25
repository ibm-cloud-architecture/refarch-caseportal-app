import { TestBed, async } from '@angular/core/testing';
import { RoutingModule } from './features/routing/routing.module';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';
import { AppComponent } from './app.component';

describe('Validate App Component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        SharedModule,
        RoutingModule,
        FeaturesModule
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

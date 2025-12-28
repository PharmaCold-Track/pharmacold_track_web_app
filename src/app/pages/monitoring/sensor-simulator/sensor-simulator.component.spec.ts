import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SensorSimulatorComponent } from './sensor-simulator.component';

describe('SensorSimulatorComponent', () => {
  let component: SensorSimulatorComponent;
  let fixture: ComponentFixture<SensorSimulatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SensorSimulatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SensorSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

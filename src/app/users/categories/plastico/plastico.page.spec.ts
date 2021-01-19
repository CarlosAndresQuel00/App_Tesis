import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlasticoPage } from './plastico.page';

describe('PlasticoPage', () => {
  let component: PlasticoPage;
  let fixture: ComponentFixture<PlasticoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlasticoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlasticoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

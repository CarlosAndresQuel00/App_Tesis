import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetalesPage } from './metales.page';

describe('MetalesPage', () => {
  let component: MetalesPage;
  let fixture: ComponentFixture<MetalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MetalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

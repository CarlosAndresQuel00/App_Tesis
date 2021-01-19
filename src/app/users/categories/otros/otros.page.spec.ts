import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtrosPage } from './otros.page';

describe('OtrosPage', () => {
  let component: OtrosPage;
  let fixture: ComponentFixture<OtrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

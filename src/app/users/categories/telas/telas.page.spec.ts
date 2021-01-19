import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TelasPage } from './telas.page';

describe('TelasPage', () => {
  let component: TelasPage;
  let fixture: ComponentFixture<TelasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TelasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

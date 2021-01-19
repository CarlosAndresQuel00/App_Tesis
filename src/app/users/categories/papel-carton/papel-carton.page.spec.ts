import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PapelCartonPage } from './papel-carton.page';

describe('PapelCartonPage', () => {
  let component: PapelCartonPage;
  let fixture: ComponentFixture<PapelCartonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PapelCartonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PapelCartonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

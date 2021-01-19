import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CristalVidrioPage } from './cristal-vidrio.page';

describe('CristalVidrioPage', () => {
  let component: CristalVidrioPage;
  let fixture: ComponentFixture<CristalVidrioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CristalVidrioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CristalVidrioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PublicationModalPage } from './publication-modal.page';

describe('PublicationModalPage', () => {
  let component: PublicationModalPage;
  let fixture: ComponentFixture<PublicationModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

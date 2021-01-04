import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPublicationPage } from './edit-publication.page';

describe('EditPublicationPage', () => {
  let component: EditPublicationPage;
  let fixture: ComponentFixture<EditPublicationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPublicationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPublicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

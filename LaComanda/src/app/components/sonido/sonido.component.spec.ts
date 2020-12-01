import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SonidoComponent } from './sonido.component';

describe('SonidoComponent', () => {
  let component: SonidoComponent;
  let fixture: ComponentFixture<SonidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SonidoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SonidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
